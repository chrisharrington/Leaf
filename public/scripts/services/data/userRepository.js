IssueTracker.app.factory("userRepository", function($rootScope, baseRepository) {
	return {
		summaries: function() {
			return baseRepository.get("users/list").then(function(users) {
				return users.data;
			});
		},

		resetPassword: function(userId) {
			return baseRepository.post("users/reset-password", { userId: userId });
		},

		remove: function(user) {
			return baseRepository.post("users/delete", user);
		},

		restore: function(user) {
			return baseRepository.post("users/undelete", user);
		},

		update: function(user) {
			return baseRepository.post("users/edit", user);
		},

		create: function(user) {
			return baseRepository.post("users/create", user).then(function(result) {
				return result.data.replace(/\"/g, "");
			});
		},

		permissions: function(userId, permissionIds) {
			return baseRepository.post("permissions", { userId: userId, permissionIds: permissionIds });
		},
		
		profile: function(profile) {
			return baseRepository.post("users/profile", profile);
		}
	}
});
