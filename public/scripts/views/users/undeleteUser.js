(function(root) {

	root.loading = ko.observable(false);

	root.restore = function(user) {
		root.user = user;
		IssueTracker.Dialog.load("confirm-undelete-user-template", root);
	};

	root.confirm = function() {
		root.user.isDeleted(false);
		_findUserInCollection(root.user).isDeleted(false);
		IssueTracker.Dialog.hide();
	};

	root.cancel = function() {
		IssueTracker.Dialog.hide();
	};

	function _findUserInCollection(user) {
		var found;
		$.each(IssueTracker.users(), function(i, current) {
			if (current.id() == user.id())
				found = current;
		});
		return found;
	}

})(root("IssueTracker.Users.Undelete"));