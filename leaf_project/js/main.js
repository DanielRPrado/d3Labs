/*
*    main.js
*/
const margin = { top: 80, right: 40, bottom: 120, left: 120 };
const width = 1000 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const svg = d3.select("#chart-area")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Scales
const xScale = d3.scaleLog()
  .domain([142, 150000])
  .range([0, width]);

const yScale = d3.scaleLinear()
  .domain([0, 90])
  .range([height, 0]);

const areaScale = d3.scaleLinear()
  .domain([2000, 1400000000])
  .range([25 * Math.PI, 1500 * Math.PI]);

let colorScale;

// Axes
const xAxis = d3.axisBottom(xScale)
  .tickValues([400, 4000, 40000])
  .tickFormat(d => `$${d}`);

const yAxis = d3.axisLeft(yScale);

const xAxisGroup = svg.append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0,${height})`);

const yAxisGroup = svg.append("g")
  .attr("class", "y-axis");

// Labels
svg.append("text")
  .attr("class", "axis-label")
  .attr("x", width / 2)
  .attr("y", height + 70)
  .style("text-anchor", "middle")
  .text("Income per capita (GDP/capita, PPP$ inflation-adjusted)");

svg.append("text")
  .attr("class", "axis-label")
  .attr("transform", "rotate(-90)")
  .attr("x", -height / 2)
  .attr("y", -80)
  .style("text-anchor", "middle")
  .text("Life expectancy (years)");

const yearLabel = svg.append("text")
  .attr("class", "year-label")
  .attr("x", width - 100)
  .attr("y", -20)
  .style("font-size", "40px")
  .style("font-weight", "bold");

d3.json("data/data.json").then(rawData => {

  const data = rawData.map(entry => ({
    year: entry.year,
    countries: entry.countries
      .filter(d => d.income && d.life_exp)
      .map(d => ({
        continent: d.continent,
        country: d.country,
        income: +d.income,
        life_exp: +d.life_exp,
        population: +d.population
      }))
  }));


  const continents = [...new Set(
    data.flatMap(d => d.countries.map(c => c.continent))
  )];
  colorScale = d3.scaleOrdinal()
    .domain(continents)
    .range(d3.schemePastel1);

  const legend = svg.selectAll(".legend")
    .data(continents)
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

  legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", colorScale);

  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(d => d);


  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);

  let currentYear = 0;
  const numYears = data.length;

  d3.interval(() => {
    update(data[currentYear]);
    currentYear = (currentYear + 1) % numYears;
  }, 1000);


  update(data[0]);
});

function update(yearData) {
  yearLabel.text(yearData.year);

  const circles = svg.selectAll("circle")
    .data(yearData.countries, d => d.country);

  // Exit
  circles.exit()
    .transition()
      .duration(500)
      .attr("r", 0)
      .remove();

  // Update
  circles.transition()
    .duration(1000)
    .attr("cx", d => xScale(d.income))
    .attr("cy", d => yScale(d.life_exp))
    .attr("r", d => Math.sqrt(areaScale(d.population) / Math.PI))
    .attr("fill", d => colorScale(d.continent));

  // Enter
  circles.enter()
    .append("circle")
      .attr("cx", d => xScale(d.income))
      .attr("cy", d => yScale(d.life_exp))
      .attr("r", 0)
      .attr("fill", d => colorScale(d.continent))
    .transition()
      .duration(1000)
      .attr("r", d => Math.sqrt(areaScale(d.population) / Math.PI));
}