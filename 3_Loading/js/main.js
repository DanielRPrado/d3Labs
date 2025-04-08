d3.csv("data/ages.csv").then((data)=> {

	console.log(data);

});

d3.tsv("data/ages.tsv").then((data)=> {

	console.log(data);

});

d3.json("data/ages.json").then((data)=> {

	console.log(data);

});

var svg = d3.select("#chart-area")
  .append("svg")
  .attr("width", 400)
  .attr("height", 400);

d3.json("data/ages.json")
  .then(data => {

    data.forEach(d => {
      d.age = +d.age;
    });

    var circles = svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", (d, i) => 50 + (i * 80))  
        .attr("cy", 200)
        .attr("r", d => d.age * 2)           
        .attr("fill", d => d.age > 10 ? "#e74c3c" : "#2ecc71") 
        .attr("stroke", "#34495e");

    console.log("Datos cargados:", data);
  })
  .catch(error => {
    console.error("Error loading data:", error);
  });

  d3.json("data/age.json")
  .then(data => {

    data.forEach(d => {
      d.age = +d.age;
    });

    var circles = svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", (d, i) => 50 + (i * 80))  
        .attr("cy", 200)
        .attr("r", d => d.age * 2)           
        .attr("fill", d => d.age > 10 ? "#e74c3c" : "#2ecc71") 
        .attr("stroke", "#34495e");

    console.log("Datos cargados:", data);
  })
  .catch(error => {
    console.error("Error loading data:", error);
  });