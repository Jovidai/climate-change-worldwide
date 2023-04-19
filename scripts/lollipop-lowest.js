// Set the dimensions of the chart
const width = auto;
const height = auto;

// Create the SVG element
const svg = d3.select("#chart2")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Define the data
const data = [
  { country: "South Georgia and the South Sandwich Islands", temperatureChange: 0.1606547619 },
  { country: "Pitcairn Islands", temperatureChange: 0.1742352941 },
  { country: "Marshall Islands", temperatureChange: 0.3277058824 },
  { country: "Wake Island", temperatureChange: 0.4051369863 },
  { country: "Chile", temperatureChange: 0.4345058824 },
  { country: "Micronesia (Federated States of)", temperatureChange: 0.4874058824 },
  { country: "India", temperatureChange: 0.6163764706 },
  { country: "Norfolk Island", temperatureChange: 0.6338805031 },
  { country: "Argentia", temperatureChange: 0.6474411765 },
  { country: "Antarctica", temperatureChange: 0.6554705882 }
];

// Define the scales
const xScale = d3.scaleBand()
  .range([0, width])
  .padding(0.1)
  .domain(data.map(d => d.country));

const yScale = d3.scaleLinear()
  .range([height, 0])
  .domain([0, d3.max(data, d => d.temperatureChange)]);

// Add the data points as circles
svg.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", d => xScale(d.country) + xScale.bandwidth() / 2)
  .attr("cy", d => yScale(d.temperatureChange))
  .attr("r", 5)
  .style("fill", "steelblue")
  .on("mouseover", handleMouseOver)
  .on("mouseout", handleMouseOut);

// Add the vertical lines as line segments
svg.selectAll("line")
  .data(data)
  .enter()
  .append("line")
  .attr("x1", d => xScale(d.country) + xScale.bandwidth() / 2)
  .attr("y1", d => yScale(d.temperatureChange))
  .attr("x2", d => xScale(d.country) + xScale.bandwidth() / 2)
  .attr("y2", height)
  .style("stroke", "black")
  .style("stroke-width", 1);

// Define the mouseover and mouseout handlers
function handleMouseOver(d, i) {
  // Change the circle color
  d3.select(this).style("fill", "red");
  // Add a tooltip
  svg.append("text")
    .attr("id", "tooltip")
    .attr("x", xScale(d.country) + xScale.bandwidth() / 2)
    .attr("y", yScale(d.temperatureChange) - 10)

}