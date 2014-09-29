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
			if (attributes.negative !== undefined)
				$(element).find("button").addClass("negative-gradient");
			$(element).on("click", "button", function() {
				if ($(element).hasClass("disabled"))
					return false;
			});
		}
	}
});