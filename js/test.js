var m = [50, 40, 50, 40],
	  w = 1300 - m[1] - m[3],
	  h = 600 - m[0] - m[2];

	svg = d3.select(".test").attr('width',w).attr('height',h).append('svg:g').attr("transform", "translate(10,10)");
var trans = function(data) {
	x = svg.selectAll("text").data(data);
	// x.transition().duration(1500).style('fill','red');	
	x.enter().append("text").attr("class", "enter").text(function(d,i) { return " Hello - " + d; }).attr('y', function(d,i) {return i*20});
	x.exit().remove();
	// x.exit().transition().remove();
	// x = x.append('text').text('hello')
	// x.transition().style("fill",'red');	
};

// i = 0
// setInterval(function() {
// 	if(i == 0) i = 1
// 	else i = 0
// 	trans(dim[i])  
// }, 1000);
var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
trans(alphabet)
d3.interval(function() {
  trans(d3.shuffle(alphabet)
      .slice(0, Math.floor(Math.random() * 26))
      .sort());
}, 1500);

// function update(data) {

//   // DATA JOIN
//   // Join new data with old elements, if any.
//   var text = svg.selectAll("text")
//     .data(data);

//   // UPDATE
//   // Update old elements as needed.
//   text.attr("class", "update");

//   // ENTER
//   // Create new elements as needed.
//   //
//   // ENTER + UPDATE
//   // After merging the entered elements with the update selection,
//   // apply operations to both.
//   text.enter().append("text")
//       .attr("class", "enter")
//       .attr("x", function(d, i) { return i * 32; })
//       .attr("dy", ".35em")
//     .merge(text)
//       .text(function(d) { return d; });

//   // EXIT
//   // Remove old elements as needed.
//   text.exit().remove();
// }

// // The initial display.
// update(alphabet);

// // Grab a random sample of letters from the alphabet, in alphabetical order.
// d3.interval(function() {
//   update(d3.shuffle(alphabet)
//       .slice(0, Math.floor(Math.random() * 26))
//       .sort());
// }, 1500);