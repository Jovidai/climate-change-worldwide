// set the dimensions and margins of the graph
var margin = {top: 100, right: 70, bottom: 150, left:250},
width = 900,
height = 400;

// append the svg object to the body of the page
var barChartSvg = d3.select("#barchart-highest")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
// .attr('viewbox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")")
.style("stroke", "black");

// Parse the Data
d3.csv("./data/climate-data-1.csv")
.then(function(data) {
// all of your code goes indside here!


// X axis
var x = d3.scaleBand()
.range([ 0, 1010 ])
.domain(data.map(function(d) { return d.country_names; }))
.padding(0.5);

barChartSvg.append("g")
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(x))
.selectAll("bar")
.data(data)
.attr("transform", "translate(8,0)rotate(-45)")
.style("text-anchor", "end");

barChartSvg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", 500)
    .attr("y", -60)
    .text("Top Ten countries that Have Highest Temperature Change")
    .style("font-family","'times new roman',times,serif")
    .style("font-size", "28px")
    .style("fill", "black");

barChartSvg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", 500)
    .attr("y", -20)
    .text("in the Last Decades")
    .style("font-family","'times new roman',times,serif")
    .style("font-size", "28px")
    .style("fill", "black");

barChartSvg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", 280)
    .attr("y", 480)
    .text("Source: Food and Agriculture Organization of the United Nations • Graphic by Zhaozhou Dai")
    .style("font-size", "15px")
    .style("font-family","'times new roman',times,serif")
    .style("fill", "black");


// barChartSvg.append("text")
//     .attr("text-anchor", "middle")
//     .attr("x", 500)
//     .attr("y", -8)
//     .text("2016 has the highest number of crime")
//     .style("font-family","Source Serif Pro, serif")
//     .style("font-size", "25px")
//     .style("fill", "#34495E");

// Add Y axis
var y = d3.scaleLinear()
.domain([0, 4])
.range([ height, 0]);
barChartSvg.append("g")
.call(d3.axisLeft(y));

var tooltip=d3.select("#tooltip")

// Bars
barChartSvg.selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", function(d) { return x(d.country_names); })
  .attr("width", x.bandwidth())
  .attr("fill", "#1ABC9C")
  // if no bar at the beginning :
  .attr("height", function(d) { return height - y(0); }) 
  .attr("y", function(d) { return y(0);})
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseout", mouseout)
  .transition()
  .duration(800)
  .attr("y", function(d) { return y(d.temperature_change); })
  .attr("height", function(d) { return height - y(d.temperature_change); })
  .delay(function(d,i){console.log(i) ; return(i*100)})

function mousemove(event, d) {
d3.select(this)
.attr("fill","#27AE60")
.attr("stroke-width", "1px")
.attr("fill-opacity", "1");
tooltip.style("display", "block")
.style("top", event.pageY + "px")
.style("left", event.pageX + "px")
.html(
 "Country Name: <b>" +
   d.country_names+
   "</b></br>Temperature Change: <b>" +
   d.temperature_change+
   "</b>"
)
   
}

function mouseover() {
  d3.select(this)
    .attr("fill","#27AE60")
    .attr("stroke-width", "1px")
    .attr("fill-opacity", "1");
  tooltip.style("opacity", 1)
       
}

function mouseout() {
  d3.select(this)
    .attr("fill", "#1ABC9C")
    .attr("stroke-width", ".3")
    .attr("fill-opacity", "1");
  tooltip.style("display", "none");
}

});


