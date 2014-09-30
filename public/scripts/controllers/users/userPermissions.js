IssueTracker.app.factory("usersUserPermissions", function($rootScope, userRepository, feedback) {
	var _scope;

	return {
		init: function() {
			return _scope = {
				show: false,
				loading: false,

				permissions: {},

				load: function(user) {
					_scope.user = user;
					_scope.show = true;
					_scope.permissions = {};

					var permissions = user.permissions.dict("permissionId");
					for (var i = 0; i < $rootScope.permissions.length; i++)
						_scope.permissions[$rootScope.permissions[i].id] = permissions[$rootScope.permissions[i].id] ? true : false;
				},

				ok: function() {
					_scope.loading = true;
					userRepository.permissions(_scope.user.id, _getPermissionIds(_scope)).then(function() {
						feedback.success(_scope.user.name + " has had their permissions updated.");
						_scope.show = false;
						_updateUserPermissions(_scope);
					}).catch(function() {
						feedback.error("An error has occurred while changing the user's permissions. Please try again later.");
					}).finally(function() {
						_scope.loading = false;
					});
				},

				cancel: function() {
					_scope.show = false;
					_scope.loading = false;
				}
			};

			function _getPermissionIds(scope) {
				var permissionIds = [];
				for (var name in scope.permissions)
					if (scope.permissions[name] === true)
						permissionIds.push(name);
				return permissionIds;
			}

			function _updateUserPermissions(scope) {
				scope.user.permissions.length = 0;
				for (var name in scope.permissions) {
					if (scope.permissions[name] === true)
						scope.user.permissions.push({ userId: scope.user.id, permissionId: name });
				}
			}
		}
	};
});