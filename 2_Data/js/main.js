var svg = d3.select("#chart-area").append("svg")

	.attr("width", 400)

	.attr("height", 400)
	.style("border", "1px solid #ccc");

var data = [25, 20, 15, 10, 5];

var rect = svg.selectAll("rect")
	.data(data)

	rect.enter().append("rect")
		.attr("x", (d, i) => { return i * 50; })
		.attr("y", d => { return 400 - d; })
		.attr("width", 40)
		.attr("height", (d) => { return d; })
		.attr("fill", "steelblue");