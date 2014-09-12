IssueTracker.app.directive("uniqueId", ["uuid", function(uuid) {
	return {
		link: function(scope, element, attributes) {
			$(element).attr("unique-id", uuid.create());
		}
	}
}]);