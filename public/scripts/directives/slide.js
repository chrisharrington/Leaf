IssueTracker.app.directive("slideVertical", function() {
	var first = true;
	return {
		restrict: "A",
		scope: {
			slide: "=slideVertical"
		},
		link: function(scope, element) {
			scope.$watch("slide", function() {
				_toggle(scope, element, !first);
				first = false;
			});

			function _toggle(scope, element, animate) {
				$(element).toggleClass("animate", animate);
				$(element).toggleClass("collapsed", !scope.slide);
			}
		}
	}
});