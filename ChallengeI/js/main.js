var svg = d3.select("#chart-area")
  .append("svg")
  .attr("width", 800)
  .attr("height", 900);

d3.json("data/buildings.json")
  .then(data => {
    data.forEach(d => {
      d.height = +d.height;
    });

    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 60)         
      .attr("y", d => 850 - d.height)      
      .attr("width", 50)                   
      .attr("height", d => d.height)       
      .attr("fill", "#27ae60")             
      .attr("stroke", "#2c3e50");        
  })
  .catch(error => {
    console.error("Error loading buildings data:", error);
  });