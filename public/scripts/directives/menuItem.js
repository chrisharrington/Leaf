IssueTracker.app.directive("menuItem", function() {
	return {
		restrict: "E",
		templateUrl: "templates/menuItem.html",
		transclude: true,
		scope: {
			icon: "@",
			url: "@",
			destination: "@"
		}
	};
});