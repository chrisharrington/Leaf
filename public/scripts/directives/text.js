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
		compile: function(element) {
			$(element).on("focus", "input", function() {
				$(element).addClass("focus");
			});

			$(element).on("blur", "input", function() {
				$(element).removeClass("focus");
			});
		}
	}
});