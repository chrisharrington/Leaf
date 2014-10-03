IssueTracker.app.factory("usersEditUser", function($rootScope, userRepository, feedback) {
	var _scope;

	return {
		init: function() {
			return _scope = {
				show: false,
				loading: false,

				load: function(user) {
					_scope.user = user;
					_scope.show = true;
				},

				users: function(users) {
					_scope.users = users;
				},

				ok: function() {
					_scope.loading = true;
					userRepository.update(_scope.user).then(function() {
						feedback.success(_scope.user.name + " has been updated.");
						_scope.show = false;
						_updateUser(_scope.user);
					}).catch(function() {
						feedback.error("An error has occurred while updating the user. Please try again later.");
					}).finally(function() {
						_scope.loading = false;
					});
				},

				cancel: function() {
					_scope.show = false;
					_scope.loading = false;
				}
			};

			function _updateUser(user) {
				$.each(_scope.users, function(i, inner) {
					if (inner.id === user.id) {
						inner.name = user.name;
						inner.emailAddress = user.emailAddress;
					}
				});

				$.each($rootScope.users, function(i, inner) {
					if (inner.id === user.id) {
						inner.name = user.name;
						inner.emailAddress = user.emailAddress;
					}
				});
			}
		}
	};
});