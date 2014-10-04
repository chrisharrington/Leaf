IssueTracker.app.directive("text", function() {
	return {
		restrict: "E",
		templateUrl: "templates/text.html",
		scope: {
			type: "@",
			placeholder: "@",
			name: "@",
			tabindex: "@tabindex",
			value: "&",
			ngModel: "="
		},
		link: function(scope, element) {
			scope.focus = function() {
				element.addClass("focus");
			};

			scope.blur = function() {
				element.removeClass("focus");
			};
		}
	}
});