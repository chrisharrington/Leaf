(function(root) {

	var _permissions;

	root.loading = ko.observable(false);
	root.name = ko.observable();

	root.load = function(user) {
		_loadPermissions(user);

		root.name(user.name());
		IssueTracker.Dialog.load("user-permissions", root);
	};

	root.isPermissionEnabled = function(permission) {
		return _permissions[permission.id()];
	};

	root.save = function() {
		alert("save");
	};

	root.cancel = function() {
		IssueTracker.Dialog.hide();
	};

	function _loadPermissions(user) {
		_permissions = {};
		$.each(user.permissions(), function(i, permission) {
			_permissions[permission.permissionId] = true;
		});
	}

})(root("IssueTracker.Users.Permissions"));