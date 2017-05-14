var margin = { top: 50, right: 0, bottom: 100, left: 110 },
          width = 960 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom,
          gridSize = Math.floor(width / 11),
          legendElementWidth = 50,
          buckets = 9,
          colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
          yr_sold = ["2006", "2007", "2008", "2009", "2010"],
          yr_built = ["1900-1909", "1910-1919", "1920-1929", "1930-1939", "1940-1949", "1950-1959", "1960-1969", "1970-1979", "1980-1989", "1990-1999", "2000-2009"];
          datasets = ["data/data.tsv", "data/data2.tsv"];

      var svg = d3.select("#chart").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom);
          
      svg = svg.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append('text').text('Year Built').attr('x', width/2).attr('y', -30);
      svg.append('text').text('Year Sold').attr('x', -100).attr('y', height/2);

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
          .data(yr_built)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * gridSize; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

      var heatmapChart = function(tsvFile) {
        d3.csv('data/heatmap.csv',
        function(d) {
          return {
            sold: +d.YearSold,
            built: d.YearBuilt,
            count: +d.Count
          };
        },
        function(error, data) {
          var sold = d3.scaleLinear().domain([2006,2010]).range([0,4]), 
            built = d3.scaleBand().domain(yr_built).range([0,11]);

          var colorScale = d3.scaleQuantile()
              .domain([0, buckets - 1, d3.max(data, function (d) { return d.count; })])
              .range(colors);

          var cards = svg.selectAll(".hour")
              .data(data);

          // cards.append("title");

          cards.enter().append("rect")
              .attr("x", function(d) { return built(d.built) * gridSize; })
              .attr("y", function(d) { return sold(d.sold) * gridSize; })
              .attr("rx", 4)
              .attr("ry", 4)
              .attr("class", "hour bordered")
              .attr("width", gridSize-5)
              .attr("height", gridSize-5)
              .style("fill", function(d) { return colorScale(d.count); })
              .append('title').text(function(d) { return d.count; });

          // cards.transition().duration(1000)
          //     .style("fill", function(d) { return colorScale(d.value); });

          // cards.select("title").text(function(d) { return d.count; });
          
          cards.exit().remove();

          var legend = svg.append('g').attr('class', 'legend').selectAll(".legend")
              .data([0].concat(colorScale.quantiles()), function(d) { return d; }).enter();

          // legend.enter().append("g")
          //     .attr("class", "legend");

          svg.append('text').text('Sold Count').attr('x', 10).attr('y', height-5);

          legend.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function(d, i) { return colors[i]; });

          legend.append("text")
            .attr("class", "mono")
            .text(function(d) { return "  >= " + Math.round(d); })
            .attr("x", function(d, i) { return legendElementWidth * i + 10; })
            .attr("y", height + gridSize -20);

          legend.exit().remove();

        });  
      };

      heatmapChart(datasets[0]);
      
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