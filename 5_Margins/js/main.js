var margin = { left: 100, right: 10, top: 10, bottom: 100 };
var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var svg = d3.select("#chart-area")
  .append("svg")
  .attr("width", 600)
  .attr("height", 400);

var g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("data/buildings.json")
  .then(data => {
    data.forEach(d => {
      d.height = +d.height;
    });

    // X Scale (Band)
    var x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, width])
      .paddingInner(0.3)
      .paddingOuter(0.3);

    // Y Scale (Linear - Flipped)
    var y = d3.scaleLinear()
      .domain([0, 828])
      .range([height, 0]);  // Flipped range

    // Color Scale
    var color = d3.scaleOrdinal()
      .domain(data.map(d => d.name))
      .range(d3.schemeSet3);

    // Axes
    var xAxisCall = d3.axisBottom(x)
      .tickSizeOuter(0);
    var yAxisCall = d3.axisLeft(y)
      .ticks(5)
      .tickFormat(d => d + "m");

    // X Axis
    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height  + ")")
      .call(xAxisCall)
      .selectAll("text")
        .attr("y", 10)
        .attr("x", -5)
        .attr("text-anchor", "end")
        .attr("font-size", "8px")
        .attr("transform", "rotate(-40)");

    // Y Axis
    g.append("g")
      .attr("class", "y-axis")
      .call(yAxisCall);

    // X Label
    g.append("text")
      .attr("class", "x-axis-label")
      .attr("x", width / 2)
      .attr("y", height + 95) 
      .attr("text-anchor", "middle")
      .text("The world's tallest buildings");

    // Y Label
    g.append("text")
      .attr("class", "y-axis-label")
      .attr("x", - (height / 2))
      .attr("y", -60)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Height (m)");

    // Bars
    g.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(d.name))
      .attr("y", d => y(d.height))  // Start at scaled height
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.height))  // Extend to bottom
      .attr("fill", d => color(d.name))
      .attr("stroke", "#2c3e50");
  })
  .catch(error => {
    console.error("Error loading data:", error);
  });