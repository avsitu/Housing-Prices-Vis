	var m = [50, 40, 50, 40],
	  w = 1300 - m[1] - m[3],
	  h = 600 - m[0] - m[2];
	var line = d3.line();
	var dragging = {};
	var x2 = d3.scaleBand().range([0, w]);
	var y2 = {};

data = ["data/graph3.csv", "data/graph33.csv"]
var svg2 = d3.select('.pc')
  .attr("width", w + m[1] + m[3])
  .attr("height", h + m[0] + m[2])
  .append("svg:g")
  .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
var background;
var foreground = svg2.append("svg:g");

function pc_init(fn) {
	d3.csv(fn, type3, function(data) { 
		var axis = d3.axisLeft();

	// Extract the list of dimensions and create a scale for each.
	x2.domain(dimensions = d3.keys(data[0]).filter(function(d) {
		if(d == 'left' || d =='department' || d == 'promotion_last_5years' || d == 'Work_accident') {return false;}
		if(d == 'salary') {
			y2[d] = d3.scalePoint().domain(data.map(function(p) {
	      return p[d];
	    })).range([h, 0]);}
		else {
	  y2[d] = d3.scaleLinear().domain([0,d3.max(data, function(p) { return p[d]; })])
	  	.range([h, 0]); } 
	  return true;
	}));
	
	update = foreground.selectAll("path")
	  .data(data);	

	  update.exit().remove();
	  
	  update.enter().append("path").attr("class", "enter").attr('fill','none')
		.attr("d", path).attr('stroke', function(d) {return d.left == 1? 'orange':'steelblue'});

	  // foreground.transition().duration(1000).style('stroke',function(d) {return 'red'});

	// Add a group element for each dimension.
	var g = svg2.selectAll(".dimension")
	  .data(dimensions)
	  .enter().append("svg:g")
	  .attr("class", "dimension")
	  .attr("transform", function(d) {
	    return "translate(" + x2(d) + ")";
	  });

	// Add an axis and title.
	g.append("svg:g")
	  .attr("class", "axis")
	  .each(function(d) {
	  	if(d == 'number_project' ) { d3.select(this).call(d3.axisRight(y2[d]).tickValues([0,1,2,3,4,5,6,7]).tickFormat(d3.format("d")));}
	  	else if(d == 'average_monthly_hours' || d == 'time_spend_company') 
	    {d3.select(this).call(d3.axisRight(y2[d]).tickFormat(d3.format("d")));}
	  	else {d3.select(this).call(d3.axisRight(y2[d]));}
	  })
	  .append("svg:text")
	  .attr("y", -9).attr('fill','black')
	  .text(String);
	});
};	

function position(d) {
  var v = dragging[d];
  return v == null ? x2(d) : v;
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

function type3(d) {
	d.satisfaction_level = +d.satisfaction_level;
	d.last_evaluation = +d.last_evaluation;
	d.number_project = +d.number_project;
	d.average_monthly_hours = +d.average_monthly_hours;
	d.time_spend_company = +d.time_spend_company;
	d.Work_accident = +d.Work_accident;
	d.left = +d.left;
	d.promotion_last_5years = +d.promotion_last_5years;
	return d;
}

pc_init(data[0]);
i = 0
d3.select('.button').on('click', function() {
	if(i == 0) i = 1;
	else i = 0;
	console.log(data[i])
	pc_init(data[i]);
})
// i = 0;
// d3.interval(function() {
// 	if(i == 0) i = 1;
// 	else i = 0;
// 	console.log(data[i])
// 	pc_init(data[i]);
// }, 5000);	
