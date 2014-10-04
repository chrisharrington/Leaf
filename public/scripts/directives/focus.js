IssueTracker.app.directive("focus", function() {
	return {
		restrict: "A",
		link: function(scope, element) {
			element.on("focus", function() {
				scope.focus();
			});
		}
	};
});