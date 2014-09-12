IssueTracker.app.directive("date", function() {
	return {
		restrict: "E",
		templateUrl: "templates/date.html",
		scope: {
			date: "=value"
		},
		link: function(scope) {
			scope.date = new Date(scope.date).toShortDateString();
		}
	}
});