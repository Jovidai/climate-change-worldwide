/* 
PRE-PROCESSING THE DATA

In this pre-processing, we do the following:
    - Select only a subset of columns to include
        in the data loading
    - Rename some of the columns
    - Coerce some of the values to Number types
    - Filter the rows to only include videos
        where the number of likes is at least
        1,000,000 likes
*/

function parseCsv(d) {
    if(+d.year >= 1) {
        return {
            sea_name: d.sea_name,
            // value: d.value,
            adjusted_sea_level: d.adjusted_sea_level,
            upper_error_bound: d.upper_error_bound,
            year: d.year, // Changing name of column/property
        }    
    }
}

d3.csv("./data/global_sea_level_change.csv", parseCsv).then(function(data) {

    console.log(data);

    /*
    DEFINE DIMENSIONS OF SVG + CREATE SVG CANVAS
    */
    const width = document.querySelector("#chart").clientWidth;
    const height = document.querySelector("#chart").clientHeight;
    const margin = {top: 100, left: 200, right: 100, bottom: 200};

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("stroke", "#EEECE7");


    /*
    
    DETERMINE MIN AND MAX VALUES OF VARIABLES

    In this section, we are computing minimum and maximum values
    of variables in the data so that we can use these values to
    construct scales. 

    */

    const year = { // x-axis
        min: d3.min(data, function(d) { return d.year; }),
        max: d3.max(data, function(d) { return d.year; })
    };

    const upper_error_bound = { // rScale
        min: d3.min(data, function(d) { return d.upper_error_bound; }),
        max: d3.max(data, function(d) { return d.upper_error_bound; })
    };

    const adjusted_sea_level = { // y-axis
        min: d3.min(data, function(d) { return d.adjusted_sea_level; }),
        max: d3.max(data, function(d) { return d.adjusted_sea_level; })
    };


    const sea_name = ["Atlantic Ocean", "Baltic Sea", "Andaman Sea", "Indian Ocean", "South China"];

    /*

    GETTING UNIQUE VALUES FOR A CATEGORICAL VARIABLE

    In the code above, and in previous demonstrations,
    we've manually created an array to hold the unique
    values of `category` in the data set.

    
    But you may recall that there is a JS array method
    that can help with this task: ARRAY.map().

    We might try to do this:

        const categories = data.map(function(d) {
            return d.category;
        });

    And expect to see an array of "Entertainment", "Music", and "Gaming".

    But in reality, we'll see these values duplicated multiple
    times -- because ARRAY.map() is simply returning the value of
    `category` for each row in the data set, and multiple videos
    have the same value of `category`.

    Unfortunately, getting unique values of these kinds of variables
    in a data set is not very straightforward. However, the
    following 2 chunks of code are 2 different ways of retrieving
    unique values.

    I won't unpack these in much detail, but they can be recycled
    in your own code, as long as you know what needs to change!

    USING d3.groups() and ARRAY.map():

        const categories = d3.groups(data, function(d) { return d.category; })
            .map(function(d) { 
                return d[0];
            })

    USING ES6 SETS and SPREAD OPERATOR:

        // Retrieve `d.category` for each row in the data set
        let allCategories = data.map(function(d) {
            return d.category;
        });

        // Turn result of above into an ES6 Set,
        // and then spread the values into a flat array
        const categories = [...new Set(allCategories)];
    */


    /*
    CREATE SCALES

    In the following scale functions, the minimum and
    maximum values of variables named `likes`, `views`,
    and `comments` are used to define the domains.

    The array named `categories` is used to define
    the domain of the d3.scaleOrdinal() function.

    Remember: `likes`, `views`, and `comments` used
    below are names of objects (that we defined!) that
    hold the maximum and minimum values of our data variables
    (that we calculated!)

    */

    const xScale = d3.scaleLinear()
        .domain([year.min, year.max])
        .range([margin.left, width-margin.right]);

    const yScale = d3.scaleLinear()
        .domain([adjusted_sea_level.min, adjusted_sea_level.max])
        .range([height-margin.bottom, margin.top]);

    const rScale = d3.scaleSqrt()
        .domain([upper_error_bound.min, upper_error_bound.max])
        .range([2, 15]);

    const fillScale = d3.scaleOrdinal()
        .domain(sea_name)
        .range(['#1ABC9C','#d95f02','#7570b3', '#A93226', '#F1948A']);



    /*
    DRAW AXES
    */
    const xAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom(xScale).scale(xScale));

    const yAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale));


    /*
    DRAW POINTS
    */
    const points = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
            .attr("cx", function(d) { return xScale(d.year); })
            .attr("cy", function(d) { return yScale(d.adjusted_sea_level); })
            .attr("r", function(d) { return rScale(d.upper_error_bound)})
            .attr("fill-opacity", 0.2)
            .attr("stroke", function(d) { return fillScale(d.sea_name); })
            .attr("stroke-width", 1.5)
            .attr("fill", function(d) { return fillScale(d.sea_name); });

    
    /*
    DRAW AXIS LABELS
    */
    const xAxisLabel = svg.append("text")
        .attr("class","axis--label")
        .attr("x", width/2)
        .attr("y", height-margin.bottom/1.5)
        .text("Year")
        .style("font-size", "20px")
        .style("fill", "#EEECE7");

    const yAxisLabel = svg.append("text")
        .attr("class","axis--label")
        .attr("transform","rotate(-90)")
        .attr("x",-height/2)
        .attr("y",margin.left/1.5)
        .text("Adjusted Sea Level")
        .style("font-size", "20px")
        .style("fill", "#EEECE7");



    /*Add Title, subtitle and caption */
    // svg.append("text")
    // .attr("text-anchor", "middle")
    // .attr("x", 200)
    // .attr("y", 60)
    // .text("Top Ten countries that Have Highest Temperature Change")
    // .style("font-family","'DM Sans', sans-serif")
    // .style("font-size", "25px")
    // .style("fill", "#EEECE7");

    svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", 650)
    .attr("y", 20)
    .text("Global Average Absolute Sea Level Change from 1880 to 2021")
    .style("font-family","'DM Sans', sans-serif")
    .style("font-size", "25px")
    .style("fill", "#EEECE7");

    svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", 500)
    .attr("y", 550)
    .text("Source: EPA's Climate Change Indicators in the United States • Graphic by Zhaozhou Dai")
    .style("font-family","'DM Sans', sans-serif")
    .style("font-size", "15px")
    .style("fill", "#EEECE7");

    svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", 470)
    .attr("y", 580)
    .text("* Note: The upper bound is the largest possible value of the true measurement.")
    .style("font-family","'DM Sans', sans-serif")
    .style("font-size", "15px")
    .style("fill", "#EEECE7");


    /* TOOLTIP */

    const tooltip = d3.select("#chart")
        .append("div")
        .attr("class", "tooltip");

    points.on("mouseover", function(e,d) {

        let x = +d3.select(this).attr("cx") + 20;
        let y = +d3.select(this).attr("cy") - 10;
        
        // Format the display of the numbers,
        // using d3.format()
        // See: https://github.com/d3/d3-format/blob/v3.1.0/README.md#format
        let displayValue = d3.format(",")(d.year);

        tooltip.style("visibility", "visible")
            .style("top", `${y}px`)
            .style("left", `${x}px`)
            .html(`<b>Year: ${displayValue}</b>
                  <br>Sea Level: ${d.adjusted_sea_level}
                  <br>Upper Error Bound: ${d.upper_error_bound}`);

        // Optionally, visually highlight the selected circle
        points.attr("opacity", 0.1);
        d3.select(this).attr("opacity", 1).raise();

    }).on("mouseout", function() {
        // Reset tooltip and circles back to original appearance
        tooltip.style("visibility", "hidden");
        points.attr("opacity", 1);
    });

    /* 
    ADDING LEGENDS

    When creating visualizations with D3, we don't automatically
    get legends for encodings like color and size. We have to
    make these ourselves!

    Making a legend with D3 and SVG requires a mixture of
    plain JavaScript, drawing basic SVG shapes, and some
    creativity with CSS. The following demonstration is
    one example of one approach to adding legends
    for encodings in a visualization.

    */


    /* 
    We start by adding a new SVG canvas to the page;
    notice that this is being inserted in a <div> element
    with ID "legend", and the size and position of this
    <div> on the page is being controlled by the CSS
    */
    const legendWidth = document.querySelector("#legend").clientWidth;
    const legendMargin = 25;
    const legendSpacing = 50;

    const colorLegend = d3.select("#legend")
        .append("svg")
        .attr("width", legendWidth)
        .attr("height", 300);


    /*
    Next, we iterate over each of the values for which
    we want to display a legend, using ARRAY.forEach().

    Here, we'll create a color legend that shows what
    category each color represents.

    So, we'll iterate over each of the values in
    the array named `categories`
    */
    sea_name.forEach(function(sea_name, i) {

        /*

        Within each loop of the .forEach(), we will
            - Draw a circle on the new legend SVG canvas,
                giving it the corresponding fill color
                for the category being drawn and spacing
                it vertically from the previously-drawn
                circle in the legend
            - Draw a text element that will serve as
                the label for each color in the legend

        */
        colorLegend.append("circle")
            .attr("cx", legendMargin)
            .attr("cy", legendMargin + i*legendSpacing)
            .attr("r", 10)
            .attr("fill", fillScale(sea_name));

        colorLegend.append("text")
            .attr("class", "legend--label")
            .attr("x", legendMargin + 25)
            .attr("y", legendMargin + i*legendSpacing)
            .text(sea_name)
            .style("fill", "#EEECE7");
    });

    /* 
    To create a size legend, we can follow much of the same procedure.
    */

    const sizeLegend = d3.select("#legend")
        .append("svg")
        .attr("width", legendWidth)
        .attr("height", 300);

    /*
    An important difference is that we don't have an array like `categories`
    that can be used to specify what values should be in the legend,
    for something like circle size.

    So, we can manually define an array that works this way, for
    3 different sizes we want to represent in the legend:
    */

    const commentLevels = [upper_error_bound.min, (upper_error_bound.max-upper_error_bound.min)/2, upper_error_bound.max];

    /*
    Then, use the new `sizes` array to draw the legend
    */
    commentLevels.forEach(function(commentCount, i) {

        /* 
        Since we're working with number values,
        it can be helpful to format the numbers
        to something a bit more human-readable.
        
        See: https://github.com/d3/d3-format/blob/v3.1.0/README.md#format
        */
        let displayCount = d3.format(",")(Math.round(commentCount));

        sizeLegend.append("circle")
            .attr("cx", legendMargin)
            .attr("cy", legendMargin + i*legendSpacing)
            .attr("r", rScale(commentCount))
            .attr("fill", "#CCCCCC");

        sizeLegend.append("text")
            .attr("class", "legend--label")
            .attr("x", legendMargin + 25)
            .attr("y", legendMargin + i*legendSpacing)
            .text(`${displayCount} Upper Error Bound`)
            .style("fill", "#EEECE7");
    });

});
