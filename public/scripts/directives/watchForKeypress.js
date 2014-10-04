IssueTracker.app.directive("watchForEscape", function($rootScope) {
	return {
		restrict: "A",
		link: function(scope, element, attributes) {
			element.on("keyup", function(e) {
				if (e.keyCode === 27)
					$rootScope.$broadcast(attributes.watchForEscape);
			})
		}
	}
});