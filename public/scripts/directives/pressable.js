IssueTracker.app.directive("pressable", function() {
	return {
		restrict: "E",
		templateUrl: "templates/pressable.html",
		transclude: true,
		scope: {
			text: "@"
		},
		link: function(scope, element) {
			$(element).on("click", function() {
				$(this).addClass("active");
			});
		}
	}
});