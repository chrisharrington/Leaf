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
						_updateUserPermissions(_scope.permissions, _scope.user);
						if (_scope.user.id === $rootScope.user.id) {
							_updateUserPermissions(_scope.permissions, $rootScope.user);
							_updateSessionUser(_scope.permissions);
							$rootScope.$broadcast("userPermissionsUpdated");
						}
					}).catch(function() {
						feedback.error("An error has occurred while changing the user's permissions. Please try again later.");
					}).finally(function() {
						_scope.loading = false;
					});
				},

				cancel: function() {
					_scope.show = false;
					_scope.loading = false;
				},

				isReadOnly: function(permission) {
					return _scope.user && $rootScope.user.id === _scope.user.id && permission.tag === "modify-user-permissions";
				}
			};

			function _getPermissionIds(scope) {
				var permissionIds = [];
				for (var name in scope.permissions)
					if (scope.permissions[name] === true)
						permissionIds.push(name);
				return permissionIds;
			}

			function _updateUserPermissions(permissions, user) {
				user.permissions.length = 0;
				for (var name in permissions) {
					if (permissions[name] === true)
						user.permissions.push({ userId: user.id, permissionId: name });
				}
			}

			function _updateSessionUser(permissions) {
				var session = JSON.parse(window.sessionStorage.getItem("session"));
				if (!session)
					return;

				var list = [];
				for (var i = 0; i < $rootScope.permissions.length; i++)
					if (permissions[$rootScope.permissions[i].id])
						list.push({ userId: session.user.id, permissionId: $rootScope.permissions[i].id });
				session.user.permissions = list;
				window.sessionStorage.setItem("session", JSON.stringify(session));
			}
		}
	};
});