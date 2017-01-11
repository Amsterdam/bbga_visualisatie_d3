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

	s = Math.abs(40/40);
	h = 40;
	/*
	 * Hoofddoek
	 */
	el = this.svg
		.append('svg')
		.attr('class','icona3')
		.attr("viewBox", "0 0 40 40")
		.attr("width", (h * s))
		.attr("height", h)
		.attr("y", -(this.margintop))
		.attr("x", this.x0(this.x0.domain()[2])+((rangeBound/2)-((h*s)/2)));

	el.append('path')
		.attr('class', 'cls-1')
		.attr('d', 'M39.6805674,39.8589783 L38.1670922,29.4968478 C38.0196814,28.200349 37.3302948,27.0258831 36.2683688,26.2621087 L36.2683688,26.2621087 C35.4653891,25.6940809 34.501301,25.3963506 33.5165957,25.4123043 L29.4439716,25.4123043 C23.8354517,29.6065025 16.120293,29.6065025 10.511773,25.4123043 L6.10893617,25.4123043 C5.12423087,25.3963506 4.16014282,25.6940809 3.35716312,26.2621087 L3.35716312,26.2621087 C2.29523712,27.0258831 1.6058505,28.200349 1.45843972,29.4968478 L0,39.8589783 L39.6805674,39.8589783 Z')	

	el.append('path')
		.attr('class', 'cls-2')
		.attr('d', 'M19.9778723,1.34365217 C13.6556612,1.34365217 8.53049645,6.44931902 8.53049645,12.7474783 C8.53049645,19.0456375 13.6556612,24.1513043 19.9778723,24.1513043 C26.3000835,24.1513043 31.4252482,19.0456375 31.4252482,12.7474783 C31.4325782,9.72076289 30.2288729,6.8159105 28.0804824,4.6756933 C25.932092,2.53547611 23.0161464,1.33635005 19.9778723,1.34365217 L19.9778723,1.34365217 Z M21.2436879,16.0644565 C21.0517002,16.3598938 20.830451,16.6354032 20.5832624,16.8868478 C20.3356028,17.1335652 19.9778723,17.2432174 19.7852482,17.5447609 C19.5614592,18.0929702 19.4492161,18.6800047 19.4550355,19.2717826 L19.4550355,20.121587 C19.4550355,20.3683043 18.7946099,20.4231304 18.5194326,20.6698478 C18.1558468,21.1083897 17.8159796,21.5659225 17.5012766,22.0405 C17.2768452,22.2895871 16.9566982,22.4318811 16.6207092,22.4318811 C16.2847202,22.4318811 15.9645732,22.2895871 15.7401418,22.0405 C15.0109582,21.4343271 14.451646,20.6504915 14.1165957,19.7652174 C13.9537562,19.1715029 13.8342013,18.566841 13.7588652,17.9559565 C13.6102911,17.0967644 13.331958,16.2649417 12.9333333,15.4887826 C12.7480516,15.1237309 12.4615441,14.8192855 12.1078014,14.6115652 C11.6950355,14.4196739 11.0621277,14.7486304 10.7043972,14.4745 C10.2604866,13.9608413 10.0599759,13.2816984 10.1540426,12.610413 C10.1392783,11.8451389 10.3497302,11.0923005 10.7594326,10.4447826 C11.224728,9.89130813 11.7951694,9.4348279 12.4380142,9.10154348 C12.7013546,8.94967761 12.9905334,8.84745615 13.2910638,8.8 L13.7588652,8.8 C13.9498847,8.76497167 14.1457181,8.76497167 14.3367376,8.8 C14.7770213,8.96447826 15.0246809,9.45791304 15.4374468,9.67721739 C15.6329353,9.78879359 15.847557,9.86316062 16.0703546,9.89652174 L16.9234043,9.89652174 C17.4259323,9.99550605 17.8864956,10.2440288 18.2442553,10.6092609 C18.3644742,10.7928139 18.4485231,10.9974851 18.4919149,11.2123478 C18.7120567,11.7880217 18.8221277,12.3911087 19.097305,12.9393696 C19.2957149,13.3525628 19.5453191,13.7393589 19.8402837,14.0907174 C20.0053901,14.2826087 20.1704965,14.5567391 20.418156,14.6389783 C20.6658156,14.7212174 21.7390071,14.0084783 22.0141844,14.2826087 C22.2893617,14.5567391 21.5739007,15.5436087 21.2436879,16.0644565 Z M29.9668085,13.0490217 C29.9625208,12.4214818 29.8886929,11.7963319 29.7466667,11.1849348 C29.5815603,10.8011522 29.3889362,10.1158261 29.0036879,10.2254783 C28.6184397,10.3351304 29.0036879,10.9656304 28.7560284,11.322 C28.5083688,11.6783696 28.3982979,12.1992174 28.3157447,12.6652391 C28.2331915,13.1312609 28.590922,13.5972826 28.3157447,13.7069348 C28.0405674,13.816587 27.5177305,13.1312609 27.5177305,12.7474783 C27.5177305,12.3636957 27.2150355,11.5413043 26.857305,10.9656304 C26.6638148,10.7129326 26.4078125,10.5145772 26.1143262,10.3899565 C25.8029671,10.2796973 25.4797308,10.2060958 25.1512057,10.1706522 L24.408227,10.0061739 C24.083241,9.99435904 23.7604136,9.94841629 23.4451064,9.8691087 C23.1424113,9.8691087 22.8947518,9.04671739 22.6195745,9.26602174 C22.3443972,9.48532609 22.7846809,10.033587 23.0598582,10.2528913 C23.3350355,10.4721957 23.8028369,10.2528913 24.0504965,10.4721957 C24.3169811,10.7614004 24.3920101,11.1778289 24.2431206,11.5413043 C24.2431206,11.8976739 23.692766,12.1169783 23.3625532,12.2814565 C23.0323404,12.4459348 22.4544681,12.8845435 22.0141844,12.7200652 C21.5739007,12.555587 21.4913475,11.8976739 21.2987234,11.5413043 C21.1060993,11.1849348 21.2987234,10.3351304 20.8584397,9.84169565 C20.5926136,9.5308854 20.2645743,9.27878923 19.8953191,9.10154348 C19.8953191,9.10154348 19.5926241,9.10154348 19.5926241,8.93706522 C19.5926241,8.77258696 20.528227,8.49845652 20.418156,8.14208696 C20.3080851,7.78571739 19.7852482,8.14208696 19.5100709,7.89536957 C19.2348936,7.64865217 19.0422695,7.29228261 18.684539,7.15521739 C18.3268085,7.01815217 18.1617021,7.15521739 17.9415603,7.15521739 C17.7214184,7.15521739 17.7764539,6.36023913 17.5012766,6.41506522 C17.2260993,6.4698913 17.5012766,7.3471087 17.1710638,7.42934783 C16.8408511,7.51158696 16.7582979,7.07297826 16.5931915,6.88108696 C16.4280851,6.68919565 16.5106383,6.05869565 16.2904965,6.05869565 C16.0703546,6.05869565 15.8777305,6.57954348 15.6025532,6.74402174 C15.2949815,6.95921172 14.9323125,7.08281069 14.5568794,7.1003913 C14.3367376,7.1003913 14.0340426,7.1003913 13.9239716,6.88108696 C13.7770508,6.37751718 13.9511643,5.8354825 14.3642553,5.51043478 C14.6669504,5.26371739 15.2448227,5.51043478 15.5475177,5.37336957 C15.8502128,5.23630435 15.5475177,4.74286957 15.8502128,4.55097826 C16.1529078,4.35908696 16.7582979,4.55097826 17.1710638,4.33167391 C17.5838298,4.11236957 17.6939007,3.86565217 18.0241135,3.72858696 C18.3520608,3.61022657 18.6945318,3.53646049 19.0422695,3.50928261 C19.3169027,3.53366182 19.5931682,3.53366182 19.8678014,3.50928261 C20.1704965,3.50928261 20.3631206,3.04326087 20.6933333,2.98843478 L20.6933333,2.98843478 C20.9409929,2.98843478 21.1611348,3.18032609 21.4087943,3.20773913 C21.6130298,3.20279811 21.8160778,3.17521509 22.0141844,3.1255 L22.5370213,3.1255 C22.7808338,3.06400142 23.0361875,3.06400142 23.28,3.1255 C27.4170567,4.53884818 30.215217,8.3908867 30.2695035,12.7474783 C30.2923184,13.1400699 30.2923184,13.5336475 30.2695035,13.9262391 C30.0493617,13.6521087 29.9943262,13.3505652 29.9392908,13.0764348 L29.9668085,13.0490217 Z')

	/*el.append("ellipse")
		.attr('class', 'cls-3')
		.attr('stroke-width', 0.57)
		.attr('cx', 19.9778723)
		.attr('cy', 12.7474783)
		.attr('rx', 11.4473759)
		.attr('ry', 11.4038261);*/

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
						return "translate("+((self.getInnerWidth()/2)-(this.getBBox().width)-25)+","+(self.getInnerHeight()+self.marginbottom-3)+")"
					} else {
						return "translate("+((self.getInnerWidth()/2)+25)+","+(self.getInnerHeight()+self.marginbottom-3)+")"
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
						return "translate("+((self.getInnerWidth()/2)-(this.getBBox().width)-6)+","+(self.getInnerHeight()+self.marginbottom-14)+")"
					} else {
						return "translate("+((self.getInnerWidth()/2)+6)+","+(self.getInnerHeight()+self.marginbottom-14)+")"
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
			if(isNaN(d) == true || d == null) {
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
			} else if(isNaN(d) == false && d != null) {
				return self.y0(100);
			} else {
				return 0;
			}
		})
		.attr("height", function(d) {
			if(d <= 100) {
				return self.y0(0)-self.y0(d);
			} else if(isNaN(d) == false && d != null) {
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
		if(isNaN(d) == false && d != null) {
			var i = d3.interpolate(this.textContent, d);
			return function(t) {
				d3.select(this).text(Math.round(i(t)));
			};
		}
	})
}

window.BBGA.Personen.prototype.createDate=function(data) {
	if(isNaN(data) == true || data == null) {
		data = 'onbekend';
	}
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
	var var_waardes = ['BEVHHMKIND_P', 'BEV65PLUS_P', 'BEVNW_P'];

	year = NaN;
	if('BEV65PLUS_P' in data) {
		if('meta' in data['BEV65PLUS_P']) {
			if('jaar' in data['BEV65PLUS_P']['meta']) {
				year = data['BEV65PLUS_P']['meta']['jaar'];
			}
		}
	}

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
	this.margintop = 0;
	this.marginbottom = 0;
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
		.attr("transform", "translate(" + this.marginleft + ","+ this.margintop +")")
		.attr("class", "donut");
}

window.BBGA.Huizen.prototype.getInnerWidth=function() {
	return (this.width-this.marginleft-this.marginright);
}

window.BBGA.Huizen.prototype.getInnerHeight=function() {
	return (this.height-this.margintop-this.marginbottom);
}

window.BBGA.Huizen.prototype.createDonut=function(data) {
	var self = this;
	this.radius = (Math.min(this.getInnerWidth(), 225) / 2);

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
		.attr("class", "circle")
		.selectAll('.donut .circle .piece')
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
			.attr('transform', 'translate(' + ((this.getInnerWidth() / 2)-140) + ',' + (225 / 2) + ')')
			.attr('d', this.arc)
			.attr('fill', function(d, i) {
				if(nrNaN == nrGroups) {
					switch(i) {
						case 0:
							return '#FFF';
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
			.attr('stroke', function(d, i) {
				if(nrNaN == nrGroups) {
					return '#E8E8E8';
				}
			})
			.each(function(d) {
				this._current = d;
			});

		this.text = this.svg.select('.donut .circle').selectAll('.donut .piece .text')
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
				if(nrNaN == nrGroups) {
					return "text text-onb";
				} else {
					return "text text-"+i;
				}
			})
			.text(function(d, i) {
				if(nrNaN == nrGroups) {
					return 'onbekend';
				} else if(isNaN(d.data) == false) {
					if(d.data > 4) {
						return d.data+"%";
					} else if(d.data > 0) {
						return d.data;
					}
				} else {
					return '';
				}
			})
			.attr("transform", function(d) {
				var x = self.arc.centroid(d);
				return "translate(" + (((x[0]+(self.getInnerWidth()/2))-140)-(this.getBBox().width/2)) + ", " + ((x[1]+(225/2))+(this.getBBox().height/4)) + ")";
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
	var woz_left = 95;
	var padding = 10;
	/*
	 * De BBOX geeft op een iPad verkeerde waardes,
	 * vandaar dat we deze tekst hoogte hardcoden.
	 */
	var text_height = 23;

	var self = this;
	wozgroup = this.svg.append('g')
		.attr("class", "woz")
	woznumber = wozgroup.append('g')
		.attr("class", "numbers");
	wozarea = wozgroup.append('g')
		.attr("class", "area");

	text = wozarea.selectAll('.text')
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
				return "text text-"+i;
			})
			.text(function(d) { return d; })
			.attr("transform", function(d, i) {
				if(i == 0) {
					return "translate("+((self.getInnerWidth()-woz_left)-(this.getBBox().width)-(21+(padding/2)))+","+ (woz_top+woz_height+35+16) + ")"
				} else {
					return "translate("+((self.getInnerWidth()-woz_left)+21+(padding/2))+","+ (woz_top+woz_height+35+16) + ")"
				}
			})

	if(this.transition > 0) {
		tmp = tmp.transition().duration(this.transition);
		tmp.style("opacity", 1);
	}

	woznumber.selectAll('.block')
		.data(b)
		.enter()
			.append("rect")
				.attr("class", function(d, i) {
					return "block block-"+i;
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

	wozarea.selectAll('.block')
		.data(b)
		.enter()
			.append("rect")
				.attr("class", function(d, i) {
					return "block block-"+i;
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

	text = woznumber.selectAll('.text')
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
				return "text text-"+i;
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

	woz = wozgroup.selectAll('.desc')
		.data(["gemiddelde WOZ-waarde* per m²"], function(d, i) {
			return d;
		})
		.enter()
		.append("text")
			.attr("class", function(d, i) {
				return "desc";
			})
			.text(function(d) { return d; })
			.attr("transform", function(d, i) {
				return "translate("+(self.getInnerWidth()-220)+",160)"
			})

	/*
	 * Huisjes
	 */
	var donut = d3.select('.donut .circle').node().getBBox();
	h = 115;
	s = Math.abs(55.08/47.82)
	el = this.svg
		.append('svg')
		.attr('class', 'iconb1')
		.attr("viewBox", "0 0 55.08 47.82")
		.attr("width", (h * s))
		.attr("height", h)
		.attr("x", -40+(this.radius-((h*s)/2)))
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
	if(isNaN(data) == true || data == null) {
		data = 'onbekend';
	}
	tmp = this.svg.selectAll('.woz.date')
		.data(["*peildatum "+data])

	tmp.exit()
		.remove();

	tmp.enter()
		.append("text")
			.attr("class", "woz date")
			.attr("transform", "translate("+((this.getInnerWidth()-71))+","+ (255) + ")")
			.text(function(d) { return d; });

	tmp.text(function(d) { return d; });
}

window.BBGA.Huizen.prototype.createDonutDate=function(data) {
	if(isNaN(data) == true || data == null) {
		data = 'onbekend';
	}
	this.date = this.svg.selectAll('.donut.date')
		.data(["peildatum "+data], function(d) {
			return d;
		})

	this.date.exit()
		.remove();

	this.date.enter()
		.append("text")
			.attr("class", "date")
			.attr("transform", "translate("+ -35 +","+(200+55)+")")
		.text(function(d) { return d; });
}

window.BBGA.Huizen.prototype.createLegend=function(data) {
	var padding = 40;
	var self = this;
	var legend = this.svg.append('g')
		.attr("class", "legend");

	text = legend.selectAll('.legend .text')
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
				return "text text-"+i;
			})
			.text(function(d) { return d; })
			.attr("transform", function(d, i) {
				return "translate("+(self.getInnerWidth()-205)+","+(self.margintop+(i*padding)+(10))+")"
			})

		tmp.style("opacity", 1);

	legend.selectAll('.legend .block')
		.data(data)
		.enter()
			.append("rect")
				.attr("class", function(d, i) {
					return "block block-"+i;
				})
				.attr("width", "12")
				.attr("height", "12")
				.attr("transform", function(d, i) {
					return "translate("+(self.getInnerWidth()-220)+","+(self.margintop+(i*padding))+")"
				})
}

window.BBGA.Huizen.prototype.create=function(obj, data) {
	obj.setAttribute('class', 'bbga_huizen');
	var var_waardes = ['WKOOP_P', 'WCORHUUR_P', 'WPARTHUUR_P'];

	year = NaN;
	if('WPARTHUUR_P' in data) {
		if('meta' in data['WPARTHUUR_P']) {
			if('jaar' in data['WPARTHUUR_P']['meta']) {
				year = data['WPARTHUUR_P']['meta']['jaar'];
			}
		}
	}
	yearw = NaN;
	if('WWOZ_M2' in data) {
		if('meta' in data['WWOZ_M2']) {
			if('jaar' in data['WWOZ_M2']['meta']) {
				yearw = data['WWOZ_M2']['meta']['jaar'];
			}
		}
	}

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
	waardes1[0] = 'onbekend';
	waardes1[1] = 'onbekend';
	if('WWOZ_M2' in data) {
		if(data['WWOZ_M2']['data'].length >= 1) {
			if('waarde' in data['WWOZ_M2']['data'][0]) {
				if(isNaN(data['WWOZ_M2']['data'][0]['waarde']) == false && data['WWOZ_M2']['data'][0]['waarde'] != null) {
					waardes1[0] = '€ '+data['WWOZ_M2']['data'][0]['waarde']+',-';
				}
			}
		}
		if(data['WWOZ_M2']['data'].length >= 2) {
			if('waarde' in data['WWOZ_M2']['data'][1]) {
				if(isNaN(data['WWOZ_M2']['data'][1]['waarde']) == false && data['WWOZ_M2']['data'][1]['waarde'] != null) {
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
