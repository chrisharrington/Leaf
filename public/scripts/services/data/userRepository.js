IssueTracker.app.factory("userRepository", function($rootScope, baseRepository) {
	return {
		summaries: function() {
			return baseRepository.get("users/list").then(function(users) {
				return users.data;
			});
		}
	}
});
