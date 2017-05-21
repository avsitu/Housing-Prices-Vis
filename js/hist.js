var m3 = [50, 40, 50, 40],
  w3 = 450 - m3[1] - m3[3],
  h3 = 400 - m3[0] - m3[2];

var x3 = d3.scaleBand().range([0, w3]).padding(0.1);
var y3 = d3.scaleLinear().range([h3, 0]);

var svg3 = d3.select('.hist')
  .attr("width", w3 + m3[1] + m3[3])
  .attr("height", h3 + m3[0] + m3[2])
  .attr("transform", "translate(" + 1050 + "," + -900 + ")");


var chart = svg3.append('g')
  .attr('width', w3)
  .attr('height', h3).attr("transform", "translate(" + 25 + "," + 30 + ")"); 

first2 = true;
function histo(hist) {
  if(first2) 
  	svg3.append('text').text('Histogram of Sale Prices').attr("transform", "translate(" + 150 + "," + 20 + ")"); 
	data2 = [];
	for(var key in hist) {
		elt = {x: key, y: hist[key]};
		data2.push(elt);
	}

	x3.domain(['100k','200k','300k','400k','500k','600k','700k','800k']);
	y3.domain([0,d3.max(data2.map(function(d) {return d.y}))]);
	// console.log(d3.max(data.map(function(d) {return d.y})));
	// console.log(d3.keys(data));


	bars = chart.selectAll('rect').data(data2);
	bars.exit().transition().duration(1000).style('opacity',0).remove();

	bars.enter().append('rect').merge(bars).attr('class','bar')
	.attr("width", x3.bandwidth())
	.attr("x", function(d) { return x3(d.x); })
	.attr("y", function(d) { return y3(d.y); })
	.attr("height", function(d) { return h3 - y3(d.y); }).style('opacity',0).attr('fill','steelblue')
	.transition().duration(1000)
      .style("opacity", 1);
		


	// bars.attr("x", function(d) { return x3(d.x); })
	// .attr("y", function(d) { return y3(d.y); })
	// .attr("height", function(d) { return h3 - y3(d.y); })
	// .style('opacity',0).attr('fill','steelblue')
	// .transition().duration(1000)
 //      .style("opacity", 1);;


	if(first2) {
		axis = d3.axisBottom(x3);
		// axis.tickValues([1,2,3,4,5,6,7,8]);
		chart.append("g")
	  .attr("class", "axis")
		.attr("transform", "translate(0," + h3 + ")")
		.call(axis);	
		chart.append("g")
	  .attr("class", "yaxis")
	  .call(d3.axisLeft(y3));   
		first2=false;
	}
	else
		d3.select('.yaxis').transition().duration(1000).call(d3.axisLeft(y3));

}