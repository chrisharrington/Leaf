
(function (root) {

	root.drawLineChart = function(container, params) {
		$(container).highcharts({
			chart: $.extend(params.chart || {}, { backgroundColor: "rgba(255, 255, 255, 0.1)", margin: [10, 10, 20, 25] }),
			title: {
				text: null
			},
			xAxis: {
				labels: {
					style: {
						fontFamily: "roboto condensed",
						fontSize: "0.8em",
						color: "#888"
					}
				},
				type: "datetime"
			},
			yAxis: {
				labels: {
					style: {
						fontFamily: "roboto condensed",
						fontSize: "0.8em",
						color: "#888"
					},
					y: 4
				},
				title: null,
				min: 0,
				gridLineColor: "#DDD"
			},
			plotOptions: {
				line: {
					shadow: false,
					lineWidth: 3,
					animation: false
				},
				series: {
					marker: {
						fillColor: "none",
						lineColor: null
					}
				}
			},
			legend: {
				enabled: false
			},
			series: [{
				data: params.data,
				name: params.name || ""
			}]
		});
	};
	
	root.drawBarChart = function(container, params) {
		if (params.data.length == 0)
			$(container).empty().append($("<span></span>").css({ "textAlign": "center", "float": "left", "width": "100%", "marginLeft": "90px" }).text("No data."));
		else {
			var categories = [];
			$.each(params.data, function () {
				categories.push(this[0]);
			});
			$(container).highcharts({
				chart: $.extend(params.chart, { backgroundColor: "rgba(255, 255, 255, 0.1)", type: "bar", margin: [10, 10, 20, params.hideYAxis ? 10 : 25] }),
				title: {
					text: null
				},
				xAxis: {
					categories: params.hideYAxis ? [] : categories,
					labels: {
						enabled: params.hideYAxis ? false : true,
						style: {
							fontFamily: "roboto condensed",
							fontSize: "0.8em",
							color: "#888"
						},
						y: 4
					}
				},
				yAxis: {
					labels: {
						style: {
							fontFamily: "roboto condensed",
							fontSize: "0.8em",
							color: "#888"
						},
						y: 4
					},
					title: null,
					gridLineColor: "#DDD"
				},
				plotOptions: {
					series: {
						type: "bar",
						marker: {
							fillColor: "none",
							lineColor: null
						}
					},
					bar: {
						colorByPoint: true,
						animation: false
					}
				},
				legend: {
					enabled: false
				},
				series: [{
					data: params.data,
					name: params.name || ""
				}]
			});
		}
	}

})(root("IssueTracker.ChartDrawer"));
