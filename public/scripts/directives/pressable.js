IssueTracker.app.directive("pressable", function($timeout) {
	return {
		restrict: "E",
		templateUrl: "templates/pressable.html",
		transclude: true,
		scope: {
			text: "@",
			disabled: "="
		},
		link: function(scope, element, attributes) {
			scope.negative = attributes.negative !== undefined;

			scope.click = function() {
				if ($(element).hasClass("disabled"))
					return false;
			};
		}
	}
});