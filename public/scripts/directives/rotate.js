IssueTracker.app.directive("rotate", function() {
	var first = true;
	return {
		restrict: "A",
		scope: {
			flag: "=rotate",
			amount: "@rotateAmount"
		},
		link: function(scope, element) {
			scope.$watch("flag", function() {
				_toggle(scope, element, !first);
				first = false;
			});

			function _toggle(scope, element, animate) {
				$(element).toggleClass(scope.amount, scope.flag);
			}
		}
	}
});