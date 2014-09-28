IssueTracker.app.directive("authorized", function($rootScope) {

	var _permissions;

	return {
		restrict: "A",
		link: function(scope, element, attributes) {
			$(element).toggle(_isAuthorized(attributes.authorized));
		}
	};


	function _isAuthorized(tag) {
		if (!_permissions)
			_buildPermissionsDictionary();

		return $rootScope.user.permissions.exists(function (x) {
			return _permissions[tag] && x.permissionId === _permissions[tag].id;
		});
	}

	function _buildPermissionsDictionary() {
		_permissions = {};
		$.each($rootScope.permissions, function (i, permission) {
			_permissions[permission.tag] = permission;
		});
	}

});