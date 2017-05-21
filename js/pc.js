var m = [50, 40, 50, 40],
  w = 1200 - m[1] - m[3],
  h = 500 - m[0] - m[2];
var line = d3.line();
var dragging = {};
var x2 = d3.scaleBand().range([0, w]);
var y2 = {};

var svg2 = d3.select('.pc')
  .attr("width", w + m[1] + m[3])
  .attr("height", h + m[0] + m[2]).append("g")
  .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

var background;
var foreground = svg2.append('g')
  .attr('width', w)
  .attr('height', h);;

var first = true;

function pc(data) {
	// d3.csv(fn, myfilter, function(data) { 
	// 	var axis = d3.axisLeft();

	// Extract the list of dimensions and create a scale for each.
	x2.domain(dimensions = d3.keys(data[0]).filter(function(d) {
			if(d == 'yr_sold' || d == 'mo_sold') return false;
			else {
		  y2[d] = d3.scaleLinear().domain([d3.min(data, function(p) { return p[d]; }),d3.max(data, function(p) { return p[d]; })])
		  	.range([h, 0]); 
		  	return true;
		  } 	
		}
	));
	price_color = d3.scaleQuantize()
	.domain([d3.min(data, function(d) { return d.price; }),d3.max(data, function(d) { return d.price; })])
	.range(["#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]);

	update = foreground.selectAll("path")
	  .data(data);	

	  update.exit().transition().duration(1000)
      .style("opacity", 0).remove();
	  
	  update.enter().append("path").attr("class", "enter").attr('fill','none').attr('stroke-width',1.5)
		.attr("d", path).attr('stroke', function(d) {return price_color(d.price)}).style('opacity',0)
		.transition().duration(1000)
      .style("opacity", 1);

 	labels = ['Bedrooms','Lot Area', 'Overall Quality', 'Year Built', 'Sale Price'];
 	if(first) {
 		for(var d=0; d < dimensions.length; d++) {
	 		svg2.append('g').attr('class', "axis"+d)
	 		.attr("transform", function() {
    	return "translate(" + x2(dimensions[d]) + ")"; });

			d3.select('.axis'+d).call(d3.axisRight(y2[dimensions[d]]))
			.append("svg:text")
		  .attr("y", -9).attr('fill','black')
	  	.text(labels[d]);
 		}
	 	first = false;
 	}
 	else {
 		for(var d=0; d < dimensions.length; d++)
			d3.select('.axis'+d).transition().duration(1000).call(d3.axisRight(y2[dimensions[d]]));
 	}
};	

function position(d) {
  var v = dragging[d];
  return x2(d);
}

function transition(g) {
  return g.transition().duration(500);
}

// Returns the path for a given data point.
function path(d) {
  return line(dimensions.map(function(p) {
    return [position(p), y2[p](d[p])];
  }));
}	

function myfilter(d) {
	return {
		bedrooms: +d.BedroomAbvGr,
		lot_area: +d.LotArea,
		quality: +d.OverallQual,
		built: +d.YearBuilt,
		price: +d.SalePrice
	};
}

// pc(data[0]);
// i = 0
// d3.select('.button').on('click', function() {
// 	if(i == 0) i = 1;
// 	else i = 0;
// 	pc(data[i]);
// })