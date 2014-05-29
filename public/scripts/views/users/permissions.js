(function(root) {

	var _user;

	root.loading = ko.observable(false);
	root.name = ko.observable();
	root.userPermissions = ko.observable();

	root.load = function(user) {
		_user = user;
		_loadPermissions(user);

		root.name(user.name());
		IssueTracker.Dialog.load("user-permissions", root);
	};

	root.togglePermission = function(permission) {
		var flag = root.userPermissions()[permission.id()]();
		root.userPermissions()[permission.id()](!flag);
	};

	root.save = function() {
		root.loading(true);
		$.post(IssueTracker.virtualDirectory + "permissions", { userId: _user.id(), permissionIds: _getEnabledPermissionIds() }).then(function() {
			IssueTracker.Feedback.success("The user's permissions have been updated.");
			IssueTracker.Dialog.hide();
			_updateUserPermissions();
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while updating the user permissions. Please try again later.");
		}).always(function() {
			root.loading(false);
		});
	};

	root.cancel = function() {
		IssueTracker.Dialog.hide();
	};

	function _loadPermissions(user) {
		var permissions = {};
		$.each(IssueTracker.permissions(), function(i, permission) {
			permissions[permission.id()] = ko.observable(user.permissions().exists(function(x) { return x.permissionId == permission.id(); }) ? permission.id() : undefined)
		});
		root.userPermissions(permissions);
	}

	function _getEnabledPermissionIds() {
		var ids = [];
		for (var name in root.userPermissions())
			if (root.userPermissions()[name]())
				ids.push(name);
		return ids;
	}

	function _updateUserPermissions() {
		var permissions = [], user = IssueTracker.Users.users().where(function(x) { return x.id() == _user.id(); })[0];
		for (var name in root.userPermissions())
			if (root.userPermissions()[name]())
				permissions.push({ permissionId: name, userId: user.id() });
		user.permissions(permissions);
	}

})(root("IssueTracker.Users.Permissions"));