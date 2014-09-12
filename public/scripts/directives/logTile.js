IssueTracker.app.directive("logTile", function() {
	return {
		restrict: "E",
		templateUrl: "templates/logTile.html",
		scope: {
			log: "="
		}
	};
});