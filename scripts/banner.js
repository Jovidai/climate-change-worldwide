var url = "https://i.ytimg.com/vi/jAa58N4Jlos/maxresdefault.jpg";

d3.json(url)
  .then(function(data) {

    d3.select("#banner")
      .style("background-image", "url('" + data[0].url + "')");

  });

  var bannerPosition = d3.scaleLinear()
  .domain([0, window.innerHeight / 2])
  .range([100, 0]);

d3.select(window)
  .on("scroll", function() {

    var y = bannerPosition(window.scrollY);
    d3.select("#banner")
      .style("background-position", "50% " + y + "%");

  });