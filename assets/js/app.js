
// container
var svgWidth = 900;
var svgHeight = 450;

var margin = {
  top: 30,
  right: 40,
  bottom: 100,
  left: 100,
};

// Import data from data.csv
d3.csv("../data/data.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.poverty = +d.poverty;
    d.healthcare= +d.healthcare;
        
  });

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// SVG
var svg = d3.select("#scatter")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);



var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  
//scales plus axes

var xLinearScale = d3.scaleLinear()
  .domain([d3.min(data, d => d.poverty)-0.5, d3.max(data, d => d.poverty)+0.5])
  .range([0, width]);

var yLinearScale = d3.scaleLinear()
  .domain([d3.min(data, d => d.healthcare)-1, d3.max(data, d => d.healthcare)+1.1])
  .range([height, 0]);
  
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

chartGroup.append("g")
  .call(leftAxis);

//Create Circles with abbreviations inside circles
var circlesGroup = chartGroup.selectAll("circle").data(data).enter();
  
var cTip=circlesGroup.append("circle")  
  .classed("stateCircle", true)
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("r", "15")
  .attr("opacity", ".5");
  

circlesGroup.append("text")
  .classed("stateText", true)
  .attr("x", d => xLinearScale(d.poverty))
  .attr("y", d => yLinearScale(d.healthcare))
  .attr("stroke", "teal")
  .attr("font-size", "10px")
  .text(d => d.abbr)
    
  
//tool tip

var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html(function(d) {
      return (`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
  });

//Create tooltip in the chart
cTip.call(toolTip);


cTip.on("mouseover", function(d) {
  d3.select(this).style("stroke", "black")
  toolTip.show(d, this);
})

  .on("mouseout", function(d, index) {
    d3.select(this).style("stroke", "steelblue")
    toolTip.hide(d);
  });

// Create axes labels
chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left + 40)
.attr("x", 0 - (height / 2))
.attr("dy", "1em")
.attr("class", "aText")
.text("Lacks Healthcare (%)");

chartGroup.append("text")
.attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
.attr("class", "aText")
.text("In Poverty (%)");
    
});
