IssueTracker.app.directive("spinner", function() {
	return {
		restrict: "E",
		templateUrl: "templates/spinner.html",
		link: function(scope, element, attributes) {
			if (attributes.big !== undefined)
				scope.big = true;
		}
	};
});