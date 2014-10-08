IssueTracker.app.directive("text", function() {
	return {
		restrict: "E",
		templateUrl: "templates/text.html",
		scope: {
			type: "@",
			placeholder: "@",
			name: "@",
			tabindex: "@tabindex",
			focus: "@",
			value: "&",
			ngModel: "="
		},
		link: function(scope, element) {
			$(element).on("focus", "input, textarea", function() {
				$(element).addClass("focus");
			});

			$(element).on("blur", "input, textarea", function() {
				$(element).removeClass("focus");
			});
		}
	}
});