(function(root) {

	root.loading = ko.observable(false);

	root.restore = function(user) {
		root.user = user;
		IssueTracker.Dialog.load("confirm-undelete-user-template", root);
	};

	root.confirm = function() {
		root.loading(true);
		$.post(IssueTracker.virtualDirectory + "users/undelete", { id: root.user.id }).done(function() {
			root.user.isDeleted(false);
			_findUserInCollection(root.user).isDeleted(false);
			IssueTracker.Dialog.hide();
			IssueTracker.Feedback.success(root.user.name() + " has been restored.");
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while restoring " + root.user.name() + ". Please try again later.");
		}).always(function() {
			root.loading(false);
		});
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