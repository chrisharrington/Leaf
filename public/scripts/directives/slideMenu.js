IssueTracker.app.directive("slideMenu", function() {
	return {
		restrict: "E",
		templateUrl: "templates/slideMenu.html",
		transclude: true,
		scope: {
			visible: "=show"
		},
		link: function(scope, element) {
			scope.$watch("visible", function(value) {
				if (!value)
					return;

				$(element).find(">div").css({ left: ($("div.actions>span.anchor").offset().left - parseInt($(element).find(">div").css("width").replace("px", ""))) + "px" });
			});
		}
	};
});