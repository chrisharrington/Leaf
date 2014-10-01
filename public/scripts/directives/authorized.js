IssueTracker.app.directive("authorized", function($rootScope) {

	var _permissions;

	return {
		restrict: "A",
		compile: function(element, attributes) {
			$rootScope.$on("userPermissionsUpdated", function() {
				_toggle(element, attributes.authorized);
			});

			return function(scope, element, attributes) {
				_toggle(element, attributes.authorized);
			};
		}
	};

	function _toggle(element, key) {
		element.toggle(_isAuthorized(key));
	}

	function _isAuthorized(tag) {
		if (!_permissions)
			_buildPermissionsDictionary();

		for (var i = 0; i < $rootScope.user.permissions.length; i++)
			if ($rootScope.user.permissions[i].permissionId === _permissions[tag].id)
				return true;
		return false;
	}

	function _buildPermissionsDictionary() {
		_permissions = {};
		$.each($rootScope.permissions, function (i, permission) {
			_permissions[permission.tag] = permission;
		});
	}

});