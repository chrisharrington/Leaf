IssueTracker.app.factory("issueRepository", function($rootScope, baseRepository) {
	return {
		search: function(parameters) {
			var colours = {};
			for (var i = 0; i < $rootScope.priorities.length; i++)
				colours[$rootScope.priorities[i]._id] = $rootScope.priorities[i].colour;

			return baseRepository.get("issues/list", parameters).then(function(issues) {
				for (var i = 0; i < issues.length; i++)
					issues[i].priorityColour = colours[issues.priorityId];
				return issues.data;
			});
		}
	}
});
