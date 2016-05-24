d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
		this.parentNode.appendChild(this);
  });
};

window.BBGA = {};

window.BBGA.Personen = function () {
	this.svg = null;
	this.parent = '';
	this.data = [];
	this.width = 600;
	this.height = 400;
	this.marginleft = 40;
	this.margintop = 40;
	this.marginbottom = 60;
	this.marginright = 30;	
	this.transition = 750;
	this.xdomain = [];
}

window.BBGA.Personen.prototype.wrap=function(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

window.BBGA.Personen.prototype.appendTo=function(obj) {
	this.parent = obj;

	this.height = d3.select(this.parent).style('height').replace('px','');
	this.width = d3.select(this.parent).style('width').replace('px','');
	
	this.svg = d3.select(this.parent).append("svg")
		.attr("width", this.width)
		.attr("height", this.height)
	.append("svg:g")
		.attr("transform", "translate(" + this.marginleft + ","+ this.margintop +")");			
}

window.BBGA.Personen.prototype.getInnerWidth=function() {
	return (this.width-this.marginleft-this.marginright);
}

window.BBGA.Personen.prototype.getInnerHeight=function() {
	return (this.height-this.margintop-this.marginbottom);
}

window.BBGA.Personen.prototype.createAxis=function(data) {
	var self = this;
	
	this.x0 =
		d3.scale.ordinal()
			.domain(data)
			.rangeRoundBands([0, this.getInnerWidth()], 0);
		
	this.xscale = 
	d3.svg.axis()
		.scale(this.x0)
		.orient("bottom");
		
	var axis = this.svg.append("g")
		.attr("class", "x-axis axis")
		.call(this.xscale)

	this.y0 =
	d3.scale.linear()
		.domain([0, 100])
		.range([this.getInnerHeight(), 0]).nice();
		
		
	this.yscale = 
		d3.svg.axis()
			.scale(this.y0)
			.tickFormat(function(d, i) { if(d == 0) { return d+'%' } else { return d; }; })
			.ticks(10)
			.orient("left");

	this.svg.append("g")
		.attr("class", "y-axis axis")
		.call(this.yscale)
		
	axis.attr("transform", "translate(0," + this.y0(0) + ")")
		.call(this.xscale)
		
	d3.selectAll('.axis.x-axis text')
		.call(this.wrap, this.x0.rangeBand());
}

window.BBGA.Personen.prototype.createGrid=function() {
	this.gridx = d3.svg.axis()
		.scale(this.x0)
		.orient("bottom")
		.ticks(10)

	this.gridy = d3.svg.axis()
		.scale(this.y0)
		.orient("left")
		.ticks(10)		
	
	this.svg.append("g")         
		.attr("class", function() {
				return "grid x-axis";
		})
		.attr("transform", "translate(0," + this.getInnerHeight() + ")")
		.call(this.gridx
			.tickSize(-(this.getInnerHeight()), 0, 0)
			.tickFormat("")
		);

	this.svg.append("g")         
		.attr("class", function() {
				return "grid y-axis";
			})
		.call(this.gridy
			.tickSize(-(this.getInnerWidth()-2), 0, -1)
			.tickFormat("")
		);
}

window.BBGA.Personen.prototype.createRegion=function() {
	region = this.svg.append("g")
		.attr("class", "region")

	region.append("rect")
		.attr("width", this.x0.rangeBand()+'px')
		.attr("height", this.getInnerHeight()+'px')
		.attr("x", "0px")
		.attr("y", "0px")

	region.append("rect")
			.attr("width", (this.x0.rangeBand())+'px')
			.attr("height", this.getInnerHeight()+'px')
			.attr("x", (this.x0(this.x0.domain()[2])-2)+'px')
			.attr("y", "0px")				
}

window.BBGA.Personen.prototype.addIcons=function() {
	this.svg.append('g')
		
	h = 40;
	s = Math.abs(27.01/19.06);
	
	rangeBound = this.x0.rangeBand();

	/*
	 * Gezin
	 */
	el = this.svg
		.append('svg')
		.attr('class', 'icona1')
		.attr("viewBox", "0 0 27.01 19.06")
		.attr("width", (h * s))
		.attr("height", h)
		.attr("y", -(this.margintop))
		.attr("x", (rangeBound/2)-((h*s)/2));

	el.append('circle')
		.attr('class', 'cls-1')
		.attr('cx', '17.07')
		.attr('cy', '1.57')
		.attr('r', '1.57');

	el.append('circle')
		.attr('class', 'cls-1')
		.attr('cx', '4.42')
		.attr('cy', '1.57')
		.attr('r', '1.57');

	el.append('circle')
		.attr('class', 'cls-1')
		.attr('cx', '9.99')
		.attr('cy', '7.59')
		.attr('r', '1.43');

	el.append('circle')
		.attr('class', 'cls-1')
		.attr('cx', '23.39')
		.attr('cy', '6.02')
		.attr('r', '1.43');

	el.append('path')
		.attr('class', 'cls-1')
		.attr('d', 'M373.66,104.51a1.77,1.77,0,0,1,1.7,2c0,0.56.31,4.48,0.31,4.86a0.68,0.68,0,0,1-.68.69,0.69,0.69,0,0,1-.69-0.69c0-.44-0.31-4.38-0.31-4.38h0V119.1a0.92,0.92,0,0,1-1.84,0v-7h-0.38v7a0.92,0.92,0,0,1-1.84,0V107h0s-0.31,3.94-.31,4.38a0.69,0.69,0,0,1-.69.69,0.68,0.68,0,0,1-.68-0.69c0-.38.31-4.29,0.31-4.86a1.77,1.77,0,0,1,1.7-2h3.46Z')
		.attr('transform', 'translate(-354.86 -100.97)');

	el.append('path')
		.attr('class', 'cls-1')
		.attr('d', 'M359.45,113.83v5.46a0.74,0.74,0,1,0,1.47,0c0-.32,0-3,0-5.46h1.41l-1.19-7.2H360.9s1.44,3.83,1.58,4.3a0.61,0.61,0,0,0,.76.41,0.59,0.59,0,0,0,.38-0.75c-0.08-.25-0.75-2.66-1.33-4.62a2.09,2.09,0,0,0-1.77-1.45H358a2.09,2.09,0,0,0-1.77,1.45l-1.36,4.62a0.61,0.61,0,0,0,.42.75,0.61,0.61,0,0,0,.76-0.41c0.14-.48,1.58-4.3,1.58-4.3H357.4l-1.19,7.2h1.41c0,2.48,0,5.14,0,5.46a0.74,0.74,0,1,0,1.47,0v-5.46h0.36Z')
		.attr('transform', 'translate(-354.86 -100.97)');

	el.append('path')
		.attr('class', 'cls-1')
		.attr('d', 'M366.39,116.18V112l1.23,1.23a0.49,0.49,0,0,0,.7-0.7c-0.16-.2-1.91-1.93-2-2a0.77,0.77,0,0,0-.53-0.19h-1.9a0.77,0.77,0,0,0-.53.19c-0.08.08-1.84,1.82-2,2a0.49,0.49,0,0,0,.7.7l1.23-1.23v4.21h3.1Z')
		.attr('transform', 'translate(-354.86 -100.97)');

	el.append('path')
		.attr('class', 'cls-1')
		.attr('d', 'M363.3,114.25c0,2.31,0,4.79,0,5.09a0.69,0.69,0,1,0,1.37,0v-5.09H365v5.09a0.69,0.69,0,1,0,1.37,0c0-.3,0-2.78,0-5.09')
		.attr('transform', 'translate(-354.86 -100.97)');

	el.append('path')
		.attr('class', 'cls-1')
		.attr('d', 'M379.8,114.61v-4.21l1.23,1.23a0.49,0.49,0,1,0,.7-0.7c-0.16-.2-1.91-1.93-2-2a0.77,0.77,0,0,0-.53-0.19h-1.9a0.77,0.77,0,0,0-.53.19c-0.08.08-1.84,1.82-2,2a0.49,0.49,0,1,0,.7.7l1.23-1.23v4.21h3.1Z')
		.attr('transform', 'translate(-354.86 -100.97)');

	el.append('path')
		.attr('class', 'cls-1')
		.attr('d', 'M376.7,114.24c0,2.31,0,4.79,0,5.09a0.69,0.69,0,1,0,1.37,0v-5.09h0.33v5.09a0.69,0.69,0,1,0,1.37,0c0-.3,0-2.78,0-5.09')
		.attr('transform', 'translate(-354.86 -100.97)');

	/*
	 * Oude man
	 */
	h = 80;
	s = Math.abs(15.56/31.36);	
	el = this.svg
		.append('svg')
		.attr('class','icona2')
		.attr("viewBox", "0 0 15.56 31.36")
		.attr("width", (h * s))
		.attr("height", h)		
		.attr("y", -(this.margintop))
		.attr("x", this.x0(this.x0.domain()[1])+((rangeBound/2)-((h*s)/2)));

	el.append('circle')
		.attr('class', 'cls-1')
		.attr('cx', '8.16')
		.attr('cy', '2.67')
		.attr('r', '2.67');

	el.append('path')
		.attr('class', 'cls-1')
		.attr('d', 'M439.3,129.27a0.56,0.56,0,0,1-.56-0.56V114.34c0-1.75-.93-2-1.49-2a1.37,1.37,0,0,0-1,.36,1.85,1.85,0,0,0-.32,1.35,0.56,0.56,0,1,1-1.11.09,2.79,2.79,0,0,1,.61-2.19,2.42,2.42,0,0,1,1.86-.71c1.6,0,2.6,1.2,2.6,3.12v14.38A0.56,0.56,0,0,1,439.3,129.27Z')
		.attr('transform', 'translate(-424.3 -98.32)');

	el.append('path')
		.attr('class', 'cls-1')
		.attr('d', 'M427.64,103.67a51.77,51.77,0,0,0-2.28,4.74,14.58,14.58,0,0,0-.85,4.75,5.38,5.38,0,0,0,1.18,3.28c0.65,0.65,1.46,1.37,1.46,1.37V128.2a1.62,1.62,0,0,0,3.17,0v-5.74l0.33-7.31a17.28,17.28,0,0,1,0-2.68,9.13,9.13,0,0,0,.13-1.11,8.28,8.28,0,0,0,2.15.91,14.63,14.63,0,0,0,3.13.39c0.85,0,1.5-.13,1.5-0.85a0.94,0.94,0,0,0-1.18-1,6.73,6.73,0,0,1-2.61-.39,7.45,7.45,0,0,1-2.4-1.73,5.78,5.78,0,0,0,.63-1.92,3,3,0,0,0-.85-2.81C430.33,103.16,428.19,102.74,427.64,103.67Z')
		.attr('transform', 'translate(-424.3 -98.32)');

	el.append('path')
		.attr('class', 'cls-1')
		.attr('d', 'M428.75,129.69A1.7,1.7,0,0,1,427,128.2V117.9c-0.2-.18-0.86-0.78-1.41-1.32a5.51,5.51,0,0,1-1.23-3.4,15.37,15.37,0,0,1,.86-4.82,51.9,51.9,0,0,1,2.3-4.78,1.37,1.37,0,0,1,1-.6,3.81,3.81,0,0,1,2.77.8,2.82,2.82,0,0,1,.93,2.58c0,0.13,0,.25,0,0.36a5.4,5.4,0,0,1-.59,1.89,7,7,0,0,0,2.24,1.59,6.39,6.39,0,0,0,2.41.38h0.13a1.12,1.12,0,0,1,1.36,1.23c0,1-1.14,1-1.69,1a14.79,14.79,0,0,1-3.18-.4,8.1,8.1,0,0,1-1.95-.79c0,0.18-.05.44-0.11,0.83a17.22,17.22,0,0,0,0,2.64h0l-0.33,7.31v5.74A1.7,1.7,0,0,1,428.75,129.69Zm0.16-26.37-0.35,0a1,1,0,0,0-.77.42c-0.26.44-2,3.75-2.27,4.71a15,15,0,0,0-.84,4.67,5.17,5.17,0,0,0,1.12,3.17c0.64,0.64,1.44,1.36,1.45,1.36l0.06,0.06V128.2a1.44,1.44,0,0,0,2.8,0v-5.74l0.33-7.31a17,17,0,0,1,0-2.71,9.42,9.42,0,0,0,.13-1.08V111l0.28,0.17a8.15,8.15,0,0,0,2.1.89,14.39,14.39,0,0,0,3.09.39c1.1,0,1.32-.25,1.32-0.66s-0.16-.86-1-0.86h-0.13a6.77,6.77,0,0,1-2.55-.4,7.54,7.54,0,0,1-2.47-1.78l-0.09-.1,0.06-.11a5.64,5.64,0,0,0,.61-1.84c0-.12,0-0.25,0-0.39A2.44,2.44,0,0,0,431,104,3.45,3.45,0,0,0,428.91,103.32Z')
		.attr('transform', 'translate(-424.3 -98.32)');

	s = Math.abs(15.78/17.35);
	h = 40;

	/*
	 * Hoofddoek
	 */
	el = this.svg
		.append('svg')
		.attr('class','icona3')
		.attr("viewBox", "0 0 15.78 17.35")
		.attr("width", (h * s))
		.attr("height", h)		
		.attr("y", -(this.margintop))
		.attr("x", this.x0(this.x0.domain()[2])+((rangeBound/2)-((h*s)/2)));

	el.append('path')
		.attr('class', 'cls-1')
		.attr('d', 'M483.77,118.5h15.78s-0.62-3.36-1-4.25-2.33-2.06-2.33-2.06a3,3,0,0,1-.82,1.23,9.1,9.1,0,0,1-3.09,2.54,24.92,24.92,0,0,1-4.39,1.37c-1.17.21,2.92-1.44,4.16-2.33a10.12,10.12,0,0,0,3.25-3.43,8.09,8.09,0,0,0,1.1-3.77,9.34,9.34,0,0,0-.55-3.7,5.11,5.11,0,0,0-1.85-2.26,3.7,3.7,0,0,0-2.29-.69,3,3,0,0,0-2.3.69,6.76,6.76,0,0,0-1.71,2.19,11.52,11.52,0,0,0-.62,3.77,9.3,9.3,0,0,0,.93,3.75,5.72,5.72,0,0,0,3,2.74,4.46,4.46,0,0,1-2.23-.4,5.34,5.34,0,0,1-1.57-1.62,12.19,12.19,0,0,0-2.19,2A33.7,33.7,0,0,0,483.77,118.5Z')
		.attr('transform', 'translate(-483.77 -101.15)');	

	el.append('path')
		.attr('class', 'cls-2')
		.attr('d', 'M491.76,105.4a13.94,13.94,0,0,1,2.77.34,8.38,8.38,0,0,1,0,3.36c-0.41,1.37-1.43,3-2.77,3s-2.44-1.78-2.78-3a10.22,10.22,0,0,1,0-3.36A17.8,17.8,0,0,1,491.76,105.4Z')
		.attr('transform', 'translate(-483.77 -101.15)');	
		
	this.svg
		.append("line")
			.attr("class", "axis frame");
}

window.BBGA.Personen.prototype.createLegend=function(data) {
	var self = this;
	text = this.svg.selectAll('.legend.text')
		.data(data, function(d, i) {
			return d;
		})
	
	tmp = text.exit();
	
	if(this.transition > 0) {
		tmp.style("opacity", 1);
		tmp = tmp.transition().duration(this.transition);
		tmp.style("opacity", 0);
	}
	tmp.remove();

	tmp = text.enter()
			.append("text")
				.style("opacity", 0)
				.attr("class", function(d, i) {
					return "legend text text-"+i;
				})
				.text(function(d) { return d; })
				.attr("transform", function(d, i) {
					if(i == 0) {
						return "translate("+((self.getInnerWidth()/2)-(this.getBBox().width)-25)+","+(self.getInnerHeight()+self.marginbottom-1)+")"
					} else {
						return "translate("+((self.getInnerWidth()/2)+25)+","+(self.getInnerHeight()+self.marginbottom-1)+")"
					}
				})

	if(this.transition > 0) {
		tmp = tmp.transition().duration(this.transition);
		tmp.style("opacity", 1);
	}

	this.svg.selectAll('.legend.block')
		.data(['Gein', 'Amsterdam'])
		.enter()
			.append("rect")
				.attr("class", function(d, i) {
					return "legend block block-"+i;
				})
				.attr("width", "12")
				.attr("height", "12")
				.attr("transform", function(d, i) {
					if(i == 0) {
						return "translate("+((self.getInnerWidth()/2)-(this.getBBox().width)-6)+","+(self.getInnerHeight()+self.marginbottom-12)+")"
					} else {
						return "translate("+((self.getInnerWidth()/2)+6)+","+(self.getInnerHeight()+self.marginbottom-12)+")"
					}
				})
				// .attr("dy", ".35em");
}

window.BBGA.Personen.prototype.createBar=function(data) {
	var self = this;
	var ymax = 0;
	var ymin = 0;
	var nrgroups = data.length;
	var nrbars = 0;
	var groups = [];

	ymax = 0;
	ymin = 0;

	
	if(typeof data[0][0] != 'undefined') {
		this.data = [];
		nrbars = data[0].length;
		for(y=0;y<nrbars;y++) {
			groups.push(y);
		}
		for(y=0;y<nrbars;y++) {
			this.data[y] = [];
			for(i=0;i<nrgroups;i++) {
				this.data[y][i] = data[i][y];
				if(data[i][y] < ymin) {
					ymin = data[i][y];
				}
				if(data[i][y] > ymax) {
					ymax = data[i][y];
				}
			}
		}
	} else {
		this.data = [];
		this.data[0] = [];
		for(i=0;i<data.length;i++) {
			this.data[0][i] = data[i];
			if(data[i] < ymin) {
				ymin = data[i];
			}
			if(data[i] > ymax) {
				ymax = data[i];
			}
		}
		nrbars = data.length;
		groups.push(0);
	}	
	
	this.barx1 = d3.scale.ordinal()
		.domain(d3.range(this.data.length))
		.rangeRoundBands([0, this.x0.rangeBand()], .5);
		
	var bars = obj = this.svg.selectAll(".bars")
		.data(this.data, function(d, i) { return i; })
		
	obj = bars.enter()
		.append("g")
		.attr("class", function(d, i) {
			return "bars bar-"+i;
		})
		// .style("class", function(d, i) { 
			// switch(i) {
				// case 0:
					// return '#999999';
				// break;
				// default:
				// case 1:
					// return '#FF0000';
				// break;
			// }
		// })
		.attr("transform", function(d, i) { return "translate(" + self.barx1(i) + ","+ -(self.getInnerHeight())+")"; })

  var bar = bars.selectAll("rect")
    .data(function(d, i) { return d; })
	var text = bars.selectAll("text")
		.data(function(d, i) { return d; });

	obj = text.enter()
		.append("text")
		.attr("class", function(d, i) {
			return "text text-"+i;
		})
		.text(function(d, i) {
			if(isNaN(d) == true) {
				return '';
			} else {
				return 0;
			}
		})
		
	obj = text;
	obj.attr("height", 0)
		.attr("y", self.getInnerHeight()-5);
	
	obj = bar.enter()
		.append("rect")
    .attr("class", function(d, i) {
			return "bargroup-"+i;
		})
		obj.style("opacity", 1);

	obj.attr("height", 0)
		.attr("y", self.getInnerHeight());
		
	obj = this.svg.selectAll(".bars")
	obj = obj.attr("transform", function(d, i) { return "translate(" + self.barx1(i) + ", 0)"; })
	
	bar = obj.selectAll("rect")
	bar = bar.transition().duration(this.transition);
	
	bar
		.attr("x", function(d, i) {
			i = self.x0.domain()[i];
			return self.x0(i);

		})
		.attr("y", function(d, i) {
			if(d <= 100) {
				return self.y0(d); 
			} else if(isNaN(d) == false) {
				return self.y0(100);
			} else {
				return 0;
			}
		})
		.attr("height", function(d) {
			if(d <= 100) {
				return self.y0(0)-self.y0(d); 
			} else if(isNaN(d) == false) {
				return self.y0(0)-self.y0(100);
			} else {
				return 0;
			}
		})
		.attr("width", function(d, i) {
			return self.barx1.rangeBand();
		})
		.style("opacity", 1)
		
	text = obj.selectAll("text")
	text = text.transition().duration(this.transition);
	text.attr("x", function(d, i) {
		i = self.x0.domain()[i];
		return self.x0(i)+((self.barx1.rangeBand()/2)-(this.getBBox().width/2)-2);
	})
	.attr("y", function(d, i) {
		if(d <= 100) {
			return self.y0(d) - 5; 
		} else {
			return self.y0(100);
		}
	})
	.tween("text", function(d) {
		if(isNaN(d) == false) {
			var i = d3.interpolate(this.textContent, d);
			return function(t) {
				d3.select(this).text(Math.round(i(t)));
			};
		}
	})
}

window.BBGA.Personen.prototype.createDate=function(data) {
	tmp = this.svg.selectAll('.date')
		.data(['peildatum '+data])
	tmp.exit()
		.remove();

	tmp.enter()
			.append("text")
				.attr("class", "date")
				.attr("transform", "translate("+(this.getInnerWidth()+(this.marginright/2))+","+this.getInnerHeight()+")rotate(-90)")
				// .attr("dy", ".35em")
				.text(function(d) { return d; });

	tmp.text(function(d) { return d; });
}

window.BBGA.Personen.prototype.create=function(obj, data) {
	obj.setAttribute('class', 'bbga_personen');
	var var_waardes = ['BEVPAARMKINDHH_P', 'BEV65PLUS_P', 'BEVOVNW_P'];

	year = data['BEV65PLUS_P']['meta']['jaar'];

	legend = [];
	legend[0] = data['BEV65PLUS_P']['data'][0]['label'];
	legend[1] = data['BEV65PLUS_P']['data'][1]['label'];

	labels = [];
	waardes = [];
	for(i in var_waardes) {
		waardes[i] = [];
		labels[i] = '';
		waardes[i][0] = NaN;
		waardes[i][1] = NaN;
		if(var_waardes[i] in data) {
			if('meta' in data[var_waardes[i]]) {
				if('label' in data[var_waardes[i]]['meta']) {
					labels[i] = data[var_waardes[i]]['meta']['label'];
				}
			}
			if('data' in data[var_waardes[i]]) {
				if(data[var_waardes[i]]['data'].length == 2) {
					if('waarde' in data[var_waardes[i]]['data'][0]) {
						waardes[i][0] = data[var_waardes[i]]['data'][0]['waarde'];
					}
					if('waarde' in data[var_waardes[i]]['data'][1]) {
						waardes[i][1] = data[var_waardes[i]]['data'][1]['waarde'];
					}
				}
			}
		}
	}

	this.appendTo(obj);
	this.createAxis(labels);
	this.createGrid();
	this.createRegion();
	this.createLegend(legend);
	this.createBar(waardes);
	this.createDate(year);
	this.addIcons();
}

window.BBGA.Huizen = function () {
	this.svg = null;
	this.parent = '';
	this.data = [];
	this.width = 600;
	this.height = 400;
	this.marginleft = 40;
	this.margintop = 40;
	this.marginbottom = 60;
	this.marginright = 30;	
	this.transition = 750;
}

window.BBGA.Huizen.prototype.appendTo=function(obj) {
	this.parent = obj;

	this.height = d3.select(this.parent).style('height').replace('px','');
	this.width = d3.select(this.parent).style('width').replace('px','');
	
	this.svg = d3.select(this.parent).append("svg")
		.attr("width", this.width)
		.attr("height", this.height)
	.append("svg:g")
		.attr("transform", "translate(" + this.marginleft + ","+ this.margintop +")");			
}

window.BBGA.Huizen.prototype.getInnerWidth=function() {
	return (this.width-this.marginleft-this.marginright);
}

window.BBGA.Huizen.prototype.getInnerHeight=function() {
	return (this.height-this.margintop-this.marginbottom);
}

window.BBGA.Huizen.prototype.createDonut=function(data) {
	var self = this;
	this.radius = (Math.min(this.getInnerWidth(), this.getInnerHeight()) / 2)-10;
	
	nrNaN = 0;
	nrGroups = data.length;
	for(i in data) {
		if(isNaN(data[i]) == true || data[i] == 0) {
			nrNaN++;
		}
	}
	if(nrNaN == nrGroups) {
		data = [100];
	}
	
	this.arc = d3.svg.arc()
		.innerRadius(this.radius - (this.radius / 2))
		.outerRadius(this.radius);

	this.pie = d3.layout.pie()
		.value(function(d) {
			if(isNaN(d) == false) {
				return d;
			} else {
				return 0;
			}
		})
		.sort(null);

	this.donut = this.svg.append('g')
		.attr("class", "donut")
		.selectAll('.donut.piece')
		.data(this.pie(data));

		tmp = this.donut.exit()
		if(this.transition > 0) {
			tmp = tmp.style("opacity", 1);
			tmp = tmp.transition().duration(this.transition);
			tmp = tmp.style("opacity", 0)
		}
		tmp.remove();

		tmp = this.donut.enter()
			.append('path')
			.attr("class", "piece")
			.attr('transform', 'translate(' + ((this.getInnerWidth() / 2)-150) + ',' + (this.getInnerHeight() / 2) + ')')
			.attr('d', this.arc)
			.attr('fill', function(d, i) { 
				if(nrNaN == nrGroups) {
					switch(i) {
						case 0:
							return '#EBEBEB';
						break;
					}
				} else {
					switch(i) {
						case 0:
							return '#00A0E6';
						break;
						default:
						case 1:
							return '#CCCCCC';
						break;
						case 2:
							return '#666666';
						break;
					}
				}
			})
			.each(function(d) { 
				this._current = d; 
			});
			
		this.text = this.svg.selectAll('.donut.piece.text')
			.data(this.pie(data));

		tmp = this.text.remove()
		if(this.transition > 0) {
			tmp = tmp.style("opacity", 1);
			tmp = tmp.transition().duration(this.transition);
			tmp = tmp.style("opacity", 0)
		}
		tmp.remove()
	
		tmp = this.text.enter().append('text')
			.style("opacity", 0)
			.attr("class", function(d, i) {
				return "donut text text-"+i;
			})
			.text(function(d, i) {
				if(nrNaN == nrGroups) {
					return '';
				} else if(isNaN(d.data) == false) {
					return d.data+"%";
				} else {
					return '';
				}
			})
			.attr("transform", function(d) {
				var x = self.arc.centroid(d);
				return "translate(" + (((x[0]+(self.getInnerWidth()/2))-150)-(this.getBBox().width/2)) + ", " + ((x[1]+(self.getInnerHeight()/2))+(this.getBBox().height/4)) + ")";
			})
			
		if(this.transition > 0) {
			tmp = tmp.transition().duration(this.transition);
			tmp.style("opacity", 1);
		}

		this.firstrun = false;
}

window.BBGA.Huizen.prototype.createInfo=function(a, b) {
	var woz_top = 155;
	var woz_height = 30;
	var woz_width = 30;
	var woz_left = 130;
	var padding = 10;
	/*
	 * De BBOX geeft op een iPad verkeerde waardes,
	 * vandaar dat we deze tekst hoogte hardcoden.
	 */
	var text_height = 23;

	var self = this;
	text = this.svg.selectAll('.custom.gem.text')
		.data(a, function(d, i) {
			return i+' '+d;
		})
	
	tmp = text.exit();

	if(this.transition > 0) {
		tmp.style("opacity", 1);
		tmp = tmp.transition().duration(this.transition);
		tmp.style("opacity", 0);
	}
	tmp.remove();

	tmp = text.enter()
		.append("text")
			.style("opacity", 0)
			.attr("class", function(d, i) {
				return "custom gem text text-"+i;
			})
			.text(function(d) { return d; })
			.attr("transform", function(d, i) {
				if(i == 0) {
					return "translate("+((self.getInnerWidth()-woz_left)-(this.getBBox().width)-(21+(padding/2)))+","+ (woz_top+woz_height+35+this.getBBox().height) + ")"
				} else {
					return "translate("+((self.getInnerWidth()-woz_left)+21+(padding/2))+","+ (woz_top+woz_height+35+this.getBBox().height) + ")"
				}
			})

	if(this.transition > 0) {
		tmp = tmp.transition().duration(this.transition);
		tmp.style("opacity", 1);
	}

	this.svg.selectAll('.custom.block')
		.data(b)
		.enter()
			.append("rect")
				.attr("class", function(d, i) {
					return "custom block block-"+i;
				})
				.attr("width", "12")
				.attr("height", "12")
				.attr("transform", function(d, i) {
					if(i == 0) {
						return "translate("+((self.getInnerWidth()-woz_left)-(this.getBBox().width)-(padding/2))+","+ (woz_top+woz_height+28+this.getBBox().height) + ")"
					} else {
						return "translate("+((self.getInnerWidth()-woz_left)+(padding/2))+","+ (woz_top+woz_height+28+this.getBBox().height) + ")"
					}
				})
				// .attr("dy", ".35em");
				
	this.svg.selectAll('.custom.woz.block')
		.data(b)
		.enter()
			.append("rect")
				.attr("class", function(d, i) {
					return "custom woz block block-"+i;
				})
				.attr("width", "120")
				.attr("height", woz_height)
				.attr("transform", function(d, i) {
					if(i == 0) {
						return "translate("+((self.getInnerWidth()-woz_left)-(this.getBBox().width)-(padding/2))+","+ (woz_top+woz_height) + ")"
					} else {
						return "translate("+((self.getInnerWidth()-woz_left)+(padding/2))+","+ (woz_top+woz_height) + ")"
					}
				})
				// .attr("dy", ".35em");

	text = this.svg.selectAll('.custom.woz.text')
		.data(b, function(d, i) {
			return i+' '+d;
		});

	tmp = text.exit();
	if(this.transition > 0) {
		tmp = tmp.transition().duration(this.transition);
		tmp.style("opacity", 0);
	}
	tmp.remove();

	tmp = text.enter()
		.append("text")
			.style("opacity", 0)
			.attr("class", function(d, i) {
				return "custom woz text text-"+i;
			})
			.text(function(d) { return d; })
			.attr("transform", function(d, i) {
				if(i == 0) {
					return "translate("+((self.getInnerWidth()-(woz_left+padding))-(this.getBBox().width)-(padding/2))+","+ (woz_top+woz_height+text_height) + ")"
				} else {
					return "translate("+((self.getInnerWidth()-(woz_left+padding))+21+(padding/2))+","+ (woz_top+woz_height+text_height) + ")"
				}
			})

	if(this.transition > 0) {
		tmp = tmp.transition().duration(this.transition);
		tmp.style("opacity", 1);
	}

	woz = this.svg.selectAll('.wozdesc')
		.data(["*gemiddelde WOZ-waarde per m²"], function(d, i) {
			return d;
		})
		.enter()
		.append("text")
			.attr("class", function(d, i) {
				return "wozdesc";
			})
			.text(function(d) { return d; })
			.attr("transform", function(d, i) {
				return "translate("+(self.getInnerWidth()-265)+",160)"
			})
			
	/*
	 * Huisjes
	 */
	var donut = d3.select('.donut').node().getBBox();
	h = 100;
	s = Math.abs(55.08/47.82)
	el = this.svg
		.append('svg')
		.attr('class', 'iconb1')
		.attr("viewBox", "0 0 55.08 47.82")
		.attr("width", (h * s))
		.attr("height", h)
		.attr("x", donut.x+(this.radius-((h*s)/2)))
		.attr("y", donut.y+(this.radius-(h/2)))

	el.append('path')
		.attr('class', 'cls-2')
		.attr('d', 'M443.77,298.69l-4-3.65v-4.79H437v2.31l-5.89-5.33L416.94,299.7s0.87,1.61,2.78,0l1.16-1v10.34a0.58,0.58,0,0,0,.58.62h7l4.76,0h6.88a0.72,0.72,0,0,0,.74-0.78V298.82l0.91,0.82a2.88,2.88,0,0,0,1.93.7')
		.attr('transform', 'translate(-389.99 -273.62)');
	
	el.append('path')
		.attr('class', 'cls-2')
		.attr('d', 'M423.7,299.58l-6.07-5.49v-5.71h-3.27v2.75l-7-6.37-16.91,14.89s1,1.92,3.32,0l1.39-1.18v12.34a0.7,0.7,0,0,0,.7.74h8.39l5.68,0h8.21a0.86,0.86,0,0,0,.89-0.93v-12l1.09,1c2.63,1.9,3.62,0,3.62,0')
		.attr('transform', 'translate(-389.99 -273.62)');

	el.append('path')
		.attr('class', 'cls-3')
		.attr('d', 'M444.82,299.64l-5.08-4.6v-4.79H437v2.31l-5.89-5.33L416.94,299.7s0.87,1.61,2.78,0l1.16-1v10.34a0.58,0.58,0,0,0,.58.62h7l4.76,0h6.88a0.72,0.72,0,0,0,.74-0.78V298.82l0.91,0.82c2.21,1.59,3,0,3,0')
		.attr('transform', 'translate(-389.99 -273.62)');

	el.append('g')
		.attr('id', '_Group_')
		.append('g')
			.attr('id','_Group_2')
				.append('polygon')
					.attr('id', '_Path_')
					.attr('class', 'cls-4')
					.attr('points', "40.19 26.97 43.4 30.02 54.94 30.02 54.94 23.83 43.4 23.83 40.19 26.97")
	
	el.append('path')
		.attr('class', 'cls-1')
		.attr('d', 'M436.71,301.86H436.2l-0.54-1.29-0.49.65v0.64h-0.46v-2.54h0.46v1.33l0.13-.19,0.84-1.14h0.46l-0.6.83Z')
		.attr('transform', 'translate(-389.99 -273.62)')
		
	el.append('path')
		.attr('class', 'cls-1')
		.attr('d', 'M437.89,301.9a0.92,0.92,0,0,1-.79-0.38,1.53,1.53,0,0,1-.28-0.94,1.43,1.43,0,0,1,.3-0.93,1,1,0,0,1,.79-0.37,0.93,0.93,0,0,1,.78.37,1.48,1.48,0,0,1,.29.93,1.44,1.44,0,0,1-.3.95A1,1,0,0,1,437.89,301.9Zm0-.37a0.53,0.53,0,0,0,.42-0.2,1.19,1.19,0,0,0,.17-0.74,1.39,1.39,0,0,0-.14-0.68,0.47,0.47,0,0,0-.44-0.25q-0.59,0-.59.95a1.32,1.32,0,0,0,.15.7A0.48,0.48,0,0,0,437.9,301.53Z')
		.attr('transform', 'translate(-389.99 -273.62)')

	el.append('path')
		.attr('class', 'cls-1')
		.attr('d', 'M440.34,301.9a0.92,0.92,0,0,1-.79-0.38,1.53,1.53,0,0,1-.28-0.94,1.43,1.43,0,0,1,.3-0.93,1,1,0,0,1,.79-0.37,0.93,0.93,0,0,1,.78.37,1.48,1.48,0,0,1,.29.93,1.44,1.44,0,0,1-.3.95A1,1,0,0,1,440.34,301.9Zm0-.37a0.53,0.53,0,0,0,.42-0.2,1.19,1.19,0,0,0,.17-0.74,1.39,1.39,0,0,0-.14-0.68,0.47,0.47,0,0,0-.44-0.25q-0.59,0-.59.95a1.32,1.32,0,0,0,.15.7A0.48,0.48,0,0,0,440.34,301.53Z')
		.attr('transform', 'translate(-389.99 -273.62)')

	el.append('path')
		.attr('class', 'cls-1')
		.attr('d', 'M442.31,301.86h-0.46v-2.54h1a0.87,0.87,0,0,1,.66.22,0.78,0.78,0,0,1,0,1.09,0.83,0.83,0,0,1-.59.22h-0.63v1Zm0-1.4h0.54a0.46,0.46,0,0,0,.32-0.1,0.36,0.36,0,0,0,.11-0.28,0.38,0.38,0,0,0-.1-0.27,0.5,0.5,0,0,0-.37-0.11h-0.5v0.76Z')
		.attr('transform', 'translate(-389.99 -273.62)')

	el.append('path')
		.attr('class', 'cls-3')
		.attr('d', 'M423.7,299.58l-6.07-5.49v-5.71h-3.27v2.75l-7-6.37-16.91,14.89s1,1.92,3.32,0l1.39-1.18v12.34a0.7,0.7,0,0,0,.7.74h8.39l5.68,0h8.21a0.86,0.86,0,0,0,.89-0.93v-12l1.09,1c2.63,1.9,3.62,0,3.62,0')
		.attr('transform', 'translate(-389.99 -273.62)')
		
	el.append('g')
		.attr('id', '_Group_3')
		.append('g')
			.attr('id','_Group_4')
				.append('polygon')
					.attr('id', '_Path_2')
					.attr('class', 'cls-4')
					.attr('points', "16.74 27.16 20.54 30.83 33.84 30.83 33.84 23.44 20.54 23.44 16.74 27.16")

	el.append('path')
		.attr('class', 'cls-1')
		.attr('d', 'M414,302.22h-0.55v-1.34h-1.17v1.34h-0.55v-3.07h0.55v1.26h1.17v-1.26H414v3.07Z')
		.attr('transform', 'translate(-389.99 -273.62)')		

	el.append('path')
		.attr('class', 'cls-1')
		.attr('d', 'M416.81,299.14v2a1.66,1.66,0,0,1-.09.62,0.81,0.81,0,0,1-.35.37,1.19,1.19,0,0,1-.63.16,1.26,1.26,0,0,1-.62-0.14,0.79,0.79,0,0,1-.35-0.37,1.47,1.47,0,0,1-.11-0.6v-2h0.57v2a0.53,0.53,0,0,0,.57.66,0.61,0.61,0,0,0,.41-0.14,0.68,0.68,0,0,0,.16-0.52v-2h0.44Z')
		.attr('transform', 'translate(-389.99 -273.62)')

	el.append('path')
		.attr('class', 'cls-1')
		.attr('d', 'M419.55,299.14v2a1.66,1.66,0,0,1-.09.62,0.81,0.81,0,0,1-.35.37,1.19,1.19,0,0,1-.63.16,1.26,1.26,0,0,1-.62-0.14,0.79,0.79,0,0,1-.35-0.37,1.47,1.47,0,0,1-.11-0.6v-2H418v2a0.53,0.53,0,0,0,.57.66,0.61,0.61,0,0,0,.41-0.14,0.68,0.68,0,0,0,.16-0.52v-2h0.44Z')
		.attr('transform', 'translate(-389.99 -273.62)')

	el.append('path')
		.attr('class', 'cls-1')
		.attr('d', 'M422.58,302.22H422L421.52,301h-0.78v1.26h-0.55v-3.07h1.33a1.15,1.15,0,0,1,.82.25,0.86,0.86,0,0,1,.26.65,0.81,0.81,0,0,1-.55.82Zm-1.84-1.71h0.69a0.67,0.67,0,0,0,.45-0.13A0.43,0.43,0,0,0,422,300a0.41,0.41,0,0,0-.14-0.33,0.6,0.6,0,0,0-.4-0.13h-0.73v0.93Z')
		.attr('transform', 'translate(-389.99 -273.62)')
}

window.BBGA.Huizen.prototype.createDate=function(data) {
	tmp = this.svg.selectAll('.woz.date')
		.data(["*peildatum "+data])

	tmp.exit()
		.remove();

	tmp.enter()
		.append("text")
			.attr("class", "woz date")
			.attr("transform", "translate("+((this.getInnerWidth()-125))+","+ (255) + ")")
			.text(function(d) { return d; });

	tmp.text(function(d) { return d; });
}

window.BBGA.Huizen.prototype.createDonutDate=function(data) {
	this.date = this.svg.selectAll('.donut.date')
		.data(["peildatum "+data], function(d) {
			return d;
		})

	this.date.exit()
		.remove(); 

	this.date.enter()
		.append("text")
			.attr("class", "donut date")
			.attr("transform", "translate("+ 0 +","+(this.getInnerHeight()+55)+")")
		.text(function(d) { return d; });
}

window.BBGA.Huizen.prototype.createLegend=function(data) {
	var self = this;
	text = this.svg.selectAll('.legend.text')
		.data(data, function(d, i) {
			return d;
		})
	
	tmp = text.exit();
	if(this.transition > 0) {
		tmp.style("opacity", 1);
		tmp = tmp.transition().duration(this.transition);
		tmp.style("opacity", 0);
	}
	tmp.remove();

	tmp = text.enter()
		.append("text")
			.style("opacity", 0)
			.style("text-anchor", "start")
			.attr("class", function(d, i) {
				return "legend text text-"+i;
			})
			.text(function(d) { return d; })
			.attr("transform", function(d, i) {
				return "translate("+(self.getInnerWidth()-245)+","+(20+(i*40)+(10))+")"
			})

		tmp.style("opacity", 1);

	this.svg.selectAll('.legend.block')
		.data(data)
		.enter()
			.append("rect")
				.attr("class", function(d, i) {
					return "legend block block-"+i;
				})
				.attr("width", "12")
				.attr("height", "12")
				.attr("transform", function(d, i) {
					return "translate("+(self.getInnerWidth()-260)+","+(20+(i*40))+")"
				})
}

window.BBGA.Huizen.prototype.create=function(obj, data) {
	obj.setAttribute('class', 'bbga_huizen');
	var var_waardes = ['WKOOP_P', 'WCORHUUR_P', 'WPARTHUUR_P'];
	
	year = data['WPARTHUUR_P']['meta']['jaar'];
	yearw = data['WWOZ_M2']['meta']['jaar'];

	labels = [];
	waardes = [];
	for(i in var_waardes) {
		waardes[i] = NaN;
		labels[i] = '';
		if(var_waardes[i] in data) {
			if('meta' in data[var_waardes[i]]) {
				if('label' in data[var_waardes[i]]['meta']) {
					labels[i] = data[var_waardes[i]]['meta']['label'];
				}
			}
			if('data' in data[var_waardes[i]]) {
				if(data[var_waardes[i]]['data'].length == 1) {
					if('waarde' in data[var_waardes[i]]['data'][0]) {
						waardes[i] = Math.round(data[var_waardes[i]]['data'][0]['waarde']);
					}
				}
			}
		}
	}

	legend = [];
	legend[0] = data['WWOZ_M2']['data'][0]['label'];
	legend[1] = data['WWOZ_M2']['data'][1]['label'];
	
	waardes1 = [];
	waardes1[0] = '€ ...';
	waardes1[1] = '€ ...';
	if('WWOZ_M2' in data) {
		if(data['WWOZ_M2']['data'].length >= 1) {
			if('waarde' in data['WWOZ_M2']['data'][0]) {
				if(isNaN(data['WWOZ_M2']['data'][0]['waarde']) == false) {
					waardes1[0] = '€ '+data['WWOZ_M2']['data'][0]['waarde']+',-';
				}
			}
		}
		if(data['WWOZ_M2']['data'].length >= 2) {
			if('waarde' in data['WWOZ_M2']['data'][1]) {
				if(isNaN(data['WWOZ_M2']['data'][1]['waarde']) == false) {
					waardes1[1] = '€ '+data['WWOZ_M2']['data'][1]['waarde']+',-';
				}
			}
		}
	}
	
	this.appendTo(obj);
	this.createDonut(waardes);
	this.createInfo(legend, waardes1);
	this.createDate(yearw);
	this.createLegend(labels);
	this.createDonutDate(year);
}