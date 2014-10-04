IssueTracker.app.directive("watchForClick", function($rootScope) {
	return {
		restrict: "A",
		link: function(scope, element, attributes) {
			element.on("click", function(e) {
				$rootScope.$broadcast(attributes.watchForClick, e.target, _getParents(e.target));
			});
		}
	};

	function _getParents(element) {
		var parents = [];
		while (element.parentElement) {
			parents.push(element.parentElement);
			element = element.parentElement;
		}
		return parents;
	}
});