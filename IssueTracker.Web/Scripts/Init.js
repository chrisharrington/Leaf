
(function(root) {

	root.init = function () {
		$("div.render-container").css("left", $(window).outerWidth() + "px");

		Path.root("#/" + IssueTracker.selectedProject().name.formatForUrl() + "/issues");
		Path.listen();

		Highcharts.setOptions({
			colors: ["#D42C2C", "#2F7ED8", "#FA9141", "#1AADCE", "#8BBC21", "#0D233A"]
		});

		IssueTracker.Header.init();

		$.ajaxPrefilter(function (options, original) {
			if (IssueTracker.selectedProject)
				options.data = $.param($.extend(original.data, { projectId: IssueTracker.selectedProject().id }));
		});

		ko.applyBindings(IssueTracker);
	};

})(root("IssueTracker.Init"));