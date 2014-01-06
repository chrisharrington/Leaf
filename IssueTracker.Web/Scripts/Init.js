
namespace("IssueTracker");

(function(root) {

	root.init = function () {
		IssueTracker.Loader.init();
		$("div.render-container").css("left", $(window).outerWidth() + "px");

		Path.root("#/dashboard");
		Path.listen();

		Highcharts.setOptions({
			colors: ["#D42C2C", "#2F7ED8", "#FA9141", "#1AADCE", "#8BBC21", "#0D233A"]
		});

		ko.applyBindings(IssueTracker);
	};

})(root("IssueTracker.Init"));

$(function () {
	IssueTracker.Init.init();
})