
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");
  
    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }
  
    // SVG wrapper dimensions are determined by the current width and
    // height of the browser window.
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;
  
    var margin = {
      top: 50,
      bottom: 50,
      right: 50,
      left: 50
    };
  
    if (svgHeight - svgHeight*.2 > 400) {var height = 400}
    else {var height = svgHeight - svgHeight*.2};
    if (svgWidth - svgWidth*.2 > 900) {var width = 900}
    else {var width = svgWidth - svgWidth*.2};
 
    // Append SVG element
    var svg = d3
      .select("#scatter")
      .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);
  
    // Append group element
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    // Read CSV
    d3.csv("data.csv").then(function(mydata) {
  
        // parse data
        mydata.forEach(function(data) {
          data.obesity = +data.obesity;
          data.poverty = +data.poverty;
        });
  
        // create scales
        var xLinearScale = d3.scaleLinear()
          .domain([0, d3.max(mydata, d => d.obesity)])
          .range([0, width]);  
        var yLinearScale = d3.scaleLinear()
          .domain([0, d3.max(mydata, d => d.poverty)])
          .range([height, 0]);
  
        // create axes
        var xAxis = d3.axisBottom(xLinearScale).ticks(6);
        var yAxis = d3.axisLeft(yLinearScale).ticks(6);
  
        // append axes
        chartGroup.append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(xAxis);
        // text label for the x axis
        svg.append("text")             
            .attr("transform",
                  "translate(" + (width/2) + " ," + 
                                (height + margin.top + 40) + ")")
            .style("text-anchor", "middle")
            .text("Obesity Scale");
        
        // text label for the y axis
        svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 48)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Poverty Scale"); 

        chartGroup.append("g")
          .call(yAxis);
  
        // append circles
        var circlesGroup = chartGroup.selectAll("circle")
          .data(mydata)
          .enter()
          .append("circle")
          .attr("cx", d => xLinearScale(d.obesity))
          .attr("cy", d => yLinearScale(d.poverty))
          .attr("r", "10")
          .attr("fill", "gold")
          .attr("stroke-width", "1")
          .attr("stroke", "black");
  
        // Step 1: Initialize Tooltip
        var toolTip = d3.tip()
          .attr("class", "tooltip")
          .offset([80, -60])
          .html(function(d) {
            return (`<strong>${d.obesity} obesity<strong><hr>${d.poverty}
            poverty`);
          });
  
        // Step 2: Create the tooltip in chartGroup.
        chartGroup.call(toolTip);
  
        // Step 3: Create "mouseover" event listener to display tooltip
        circlesGroup.on("mouseover", function(d) {
          toolTip.show(d, this);
        })
        // Step 4: Create "mouseout" event listener to hide tooltip
          .on("mouseout", function(d) {
            toolTip.hide(d);
          });
      }).catch(function(error) {
        console.log(error);
      });
  
  
  
    }
  
  // When the browser loads, makeResponsive() is called.
  makeResponsive();
  
  // When the browser window is resized, makeResponsive() is called.
  d3.select(window).on("resize", makeResponsive);
  