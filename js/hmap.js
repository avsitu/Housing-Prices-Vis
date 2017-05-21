
var margin = { top: 50, right: 0, bottom: 100, left: 110 },
          width = 1000 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom,
          gridSize = Math.floor(width / 12),
          legendElementWidth = 50,
          buckets = 9,
          colors = ["rgb(255, 255, 183)","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
          yr_sold = ["2006", "2007", "2008", "2009", "2010"],
          mo_sold = [1,2,3,4,5,6,7,8,9,10,11,12];
          datasets = ["data/data.tsv", "data/data2.tsv"];

var svg = d3.select(".chart")
    .attr("width", width + margin.left + margin.right + 50)
    .attr("height", height + margin.top + margin.bottom)
    .attr("transform", "translate(" + 0 + "," + 0 + ")");;
// svg.append("rect")
//     .attr("width", "100%")
//     .attr("height", "100%")
//     .attr("fill", '#4a4b4f');    
    
svg = svg.append("g")
.attr('width', width)
  .attr('height', height) 
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append('text').text('Sale Month').attr('x', width/2).attr('y', -30);
svg.append('text').text('Sale Year').attr('x', -100).attr('y', height/2);
price_scale = d3.scaleQuantize().domain([0,800000]).range(['100k','200k','300k','400k','500k','600k','700k','800k']);
hist = {};

var dayLabels = svg.selectAll(".dayLabel")
    .data(yr_sold)
    .enter().append("text")
      .text(function (d) { return d; })
      .attr("x", 0)
      .attr("y", function (d, i) { return i * gridSize; })
      .style("text-anchor", "end")
      .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
      .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

var timeLabels = svg.selectAll(".timeLabel")
    .data(mo_sold)
    .enter().append("text")
      .text(function(d) { return d; })
      .attr("x", function(d, i) { return i * gridSize; })
      .attr("y", 0)
      .style("text-anchor", "middle")
      .attr("transform", "translate(" + gridSize / 2 + ", -6)");
      // .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

function heatmapChart(tsvFile) {
  d3.csv('data/heatmap.csv',
  function(d) {
    return {
      year: +d.YearSold,
      month: +d.MonthSold,
      count: +d.Count
    };
  },
  function(error, data) {
    // console.log(data)
    var yr_sold = d3.scaleLinear().domain([2006,2010]).range([0,4]);
      // mo_sold2 = d3.scaleBand().domain(mo_sold).range([0,11]);

    var colorScale = d3.scaleQuantile()
        .domain([0, buckets - 1, d3.max(data, function (d) { return d.count; })])
        .range(colors);

    var cards = svg.selectAll(".hour")
        .data(data);

    // cards.append("title");

    cards.enter().append("rect")
        .attr("y", function(d) { return yr_sold(d.year) * gridSize; })
        .attr("x", function(d) { return (d.month-1) * gridSize; })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "hour bordered")
        .attr("width", gridSize-5)
        .attr("height", gridSize-5)
        .style("fill", function(d) { return colorScale(d.count); })
        .on('click', function(d) {
          var selection;
          d3.csv('data/housing_prices.csv', myfilter2, function(error, data2){
            selection = data2.filter(function(r) {
              if(r.yr_sold == d.year && r.mo_sold == d.month) return true;
              else return false;
            })

            for(var i = 0; i < selection.length; i++)  {
              if(hist.hasOwnProperty(price_scale(selection[i].price))) hist[price_scale(selection[i].price)]++;
              else hist[price_scale(selection[i].price)]=1;
            }
            // console.log(hist);
            pc(selection);
            histo(hist);
            hist = {};
          })

        })
        .on("mouseover", function(d,i) {
        d3.select(this).transition()
            .duration(500)
            .attr("width", gridSize+5).attr("height", gridSize+5)
            .attr("y", function(d) { return yr_sold(d.year) * gridSize -5; })
            .attr("x", function(d) { return (d.month-1) * gridSize -5; })
          })
        .on("mouseout", function(d,i) {
        d3.select(this).transition()
            .duration(500)
            .attr("width", gridSize-5).attr("height", gridSize-5)
            .attr("y", function(d) { return yr_sold(d.year) * gridSize; })
            .attr("x", function(d) { return (d.month-1) * gridSize; })
          })
        .append('title').text(function(d) { return d.count; });

    // cards.transition().duration(1000)
    //     .style("fill", function(d) { return colorScale(d.value); });

    // cards.select("title").text(function(d) { return d.count; });
    
    // cards.exit().remove();

    var legend = svg.append('g').attr('class', 'legend').attr('transform', 'translate(0,10)').selectAll(".legend")
        .data([0].concat(colorScale.quantiles()), function(d) { return d; }).enter();

    // legend.enter().append("g")
    //     .attr("class", "legend");

    svg.append('text').text('Sales Count:').attr('x', -90).attr('y', height+80);

    legend.append("rect")
      .attr("x", function(d, i) { return legendElementWidth * i; })
      .attr("y", height + 35)
      .attr("width", legendElementWidth)
      .attr("height", gridSize / 2)
      .style("fill", function(d, i) { return colors[i]; });

    legend.append("text")
      .attr("class", "mono")
      .text(function(d) { return "  >= " + Math.round(d); })
      .attr("x", function(d, i) { return legendElementWidth * i + 10; })
      .attr("y", height + gridSize + 10);

    legend.exit().remove();

  });  
};

heatmapChart(datasets[0]);

function myfilter2(d) {
  return {
    bedrooms: +d.BedroomAbvGr,
    lot_area: +d.LotArea,
    quality: +d.OverallQual,
    built: +d.YearBuilt,
    price: +d.SalePrice,
    yr_sold: +d.YrSold,
    mo_sold: +d.MoSold
  };
}

// var datasetpicker = d3.select("#dataset-picker").selectAll(".dataset-button")
//   .data(datasets);

// datasetpicker.enter()
//   .append("input")
//   .attr("value", function(d){ return "Dataset " + d })
//   .attr("type", "button")
//   .attr("class", "dataset-button")
//   .on("click", function(d) {
//     heatmapChart(d);
//   });

// pc('data/house_small.csv');
