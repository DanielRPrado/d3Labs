/*
*    main.js
*/

const margin = { top: 100, right: 40, bottom: 70, left: 90 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;
var flag = true;

const colorScale = d3.scaleOrdinal()
  .range(["#e41a1c", "#377eb8"]);

const svg = d3.select("#chart-area")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

const chart = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const xScale = d3.scaleBand()
  .range([0, width])
  .padding(0.2);

const yScale = d3.scaleLinear()
  .range([height, 0]);

const xAxisGroup = chart.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${height})`);

const yAxisGroup = chart.append("g")
    .attr("class", "axis y-axis");

chart.append("text")
    .attr("class", "chart-title")
    .attr("x", width/2)
    .attr("y", -60)
    .attr("text-anchor", "middle")
    .style("font-size", "24px")
    .text("Financial Performance");

chart.append("text")
    .attr("class", "chart-subtitle")
    .attr("x", width/2)
    .attr("y", height + 50)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Months");

const yLabel = chart.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -height/2)
    .attr("y", -70)
    .attr("text-anchor", "middle")
    .style("font-size", "16px");

d3.json("data/revenues.json").then(data => {
    data.forEach(d => {
        d.revenue = +d.revenue;
        d.month = d3.timeParse("%B")(d.month); // Convertir a objeto Date
    });

    data.sort((a, b) => a.month - b.month);

    updateVisualization(data);

}).catch(error => console.error("Error loading data:", error));

function updateVisualization(data) {
    var value = flag ? "revenue" : "profit";

    xScale.domain(data.map(d => d3.timeFormat("%b")(d.month))); 
    yScale.domain([0, d3.max(data, d => d[value])]);

    const t = d3.transition().duration(750);

    xAxisGroup.transition(t)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)");

    yAxisGroup.transition(t)
        .call(d3.axisLeft(yScale)
            .ticks(5)
            .tickFormat(d => `$${d3.format(",.0f")(d)}`));

    yLabel.text(value === 'revenue' ? "Revenues (USD)" : "Profits (USD)");

    // JOIN
    const bars = chart.selectAll(".bar")
        .data(data, d => d.month); 

    // EXIT
    bars.exit()
        .transition(t)
            .attr("y", height)
            .attr("height", 0)
            .remove();

    // UPDATE
    bars.transition(t)
        .attr("x", d => xScale(d3.timeFormat("%b")(d.month)))
        .attr("width", xScale.bandwidth())
        .attr("y", d => yScale(d[value]))
        .attr("height", d => height - yScale(d[value]))
        .attr("fill", );

    // ENTER
    bars.enter()
        .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d3.timeFormat("%b")(d.month)))
            .attr("width", xScale.bandwidth())
            .attr("y", height)
            .attr("height", 0)
            .attr("fill", "red")
        .transition(t)
            .attr("y", d => yScale(d[value]))
            .attr("height", d => height - yScale(d[value]));
}