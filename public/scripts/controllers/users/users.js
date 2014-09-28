IssueTracker.app.controller("users", function($scope, authentication, users) {
	authentication.check();
	users.load($scope);
});

IssueTracker.app.factory("users", function(userRepository, feedback, usersResetPassword) {
	return {
		load: function(scope) {
			scope.resetPassword = usersResetPassword.init();

			scope.blah = function() {
				debugger;
			};

			_getUsers(scope);
		}
	};

	function _getUsers(scope) {
		scope.loading = true;
		userRepository.summaries().then(function(users) {
			scope.users = users;
		}).catch(function() {
			feedback.error("An error has occurred while retrieving the user list. Please try again later.");
		}).finally(function() {
			scope.loading = false;
		});
	}
});