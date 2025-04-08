var svg = d3.select("#chart-area")
  .append("svg")
  .attr("width", 500)
  .attr("height", 500);

d3.json("data/buildings.json")
  .then(data => {
    data.forEach(d => {
      d.height = +d.height;
    });

    // Create x scale (band scale)
    var x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, 400])
      .paddingInner(0.3)
      .paddingOuter(0.3);

    // Create y scale (linear scale)
    var y = d3.scaleLinear()
      .domain([0, 828])
      .range([0, 400]);

    // Create color scale (ordinal scale)
    var color = d3.scaleOrdinal()
      .domain(data.map(d => d.name))
      .range(d3.schemeSet3);

    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(d.name))
      .attr("y", d => 400 - y(d.height))
      .attr("width", x.bandwidth())
      .attr("height", d => y(d.height))
      .attr("fill", d => color(d.name))
      .attr("stroke", "#2c3e50");
  })
  .catch(error => {
    console.error("Error loading buildings data:", error);
  });