IssueTracker.app.directive("blur", function() {
	return {
		restrict: "A",
		link: function(scope, element) {
			element.on("blur", function() {
				scope.blur();
			});
		}
	};
});