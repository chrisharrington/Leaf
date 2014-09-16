IssueTracker.app.directive("pressable", function($timeout) {
	return {
		restrict: "E",
		templateUrl: "templates/pressable.html",
		transclude: true,
		scope: {
			text: "@"
		},
		link: function(scope, element) {
			$(element).on("click", "button", function() {
				if ($(element).hasClass("disabled"))
					return false;
			});
		}
	}
});