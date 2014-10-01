IssueTracker.app.factory("usersCreateUser", function($rootScope, userRepository, feedback) {
	var _scope;

	return {
		init: function() {
			return _scope = {
				show: false,
				loading: false,

				load: function() {
					_scope.user = {
						name: "",
						emailAddress: ""
					};
					_scope.show = true;
				},

				users: function(users) {
					_scope.users = users;
				},

				ok: function() {
					if (!_validate())
						return;

					_scope.loading = true;
					userRepository.create(_scope.user).then(function(id) {
						_scope.user.id = id;
						feedback.success(_scope.user.name + " has been created.");
						_scope.show = false;
						_addUserToList(_scope.user);
					}).catch(function() {
						feedback.error("An error has occurred while creating the user. Please try again later.");
					}).finally(function() {
						_scope.loading = false;
					});

					function _validate() {
						if (_scope.user.name === "") {
							feedback.error("The name is required.");
							return false;
						}

						if (_scope.user.emailAddress === "") {
							feedback.error("The email address is required.");
							return false;
						}

						if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(_scope.user.emailAddress)) {
							feedback.error("The email address is invalid.");
							return false;
						}

						return true;
					}
				},

				cancel: function() {
					_scope.show = false;
					_scope.loading = false;
				}
			};

			function _addUserToList(user) {
				_scope.users.push({
					id: user.id,
					name: user.name,
					emailAddress: user.emailAddress,
					isActivated: false,
					isDeleted: false,
					permissions: []
				});

				$rootScope.users.push({
					id: user.id,
					name: user.name,
					emailAddress: user.emailAddress,
					isDeleted: false,
					permissions: []
				});
			}
		}
	};
});