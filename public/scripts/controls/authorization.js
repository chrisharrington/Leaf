(function(root) {

	var _permissions;

	root.isAuthorized = function(tag) {
		if (!_permissions)
			_buildPermissionsDictionary();

		return IssueTracker.signedInUser().permissions().exists(function(x) {
			return x.permissionId == _permissions[tag].id();
		});
	};

	function _buildPermissionsDictionary() {
		_permissions = {};
		$.each(IssueTracker.permissions(), function(i, permission) {
			_permissions[permission.tag()] = permission;
		});
	}

})(root("IssueTracker"));