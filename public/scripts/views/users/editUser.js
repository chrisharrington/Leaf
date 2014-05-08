
(function (root) {

	root.user = ko.observable();
	root.loading = ko.observable(false);

	root.edit = function (user) {
		root.user(user);
		IssueTracker.Dialog.load("edit-user-template", root);
	};

	root.save = function () {
		root.loading(true);
		$.post(IssueTracker.virtualDirectory + "Users/Edit", root.user()).done(function() {
			IssueTracker.Feedback.success(root.user().name() + " has been saved.");
			IssueTracker.Dialog.hide();
			_updateUserInList();
			_updateSignedInUser();
		}).fail(function () {
			IssueTracker.Feedback.error("An error has occurred while editing the user. Please try again later.");
		}).always(function() {
			root.loading(false);
		});
	};

	root.cancel = function() {
		IssueTracker.Dialog.hide();
	};

	function _updateUserInList() {
		$.each(IssueTracker.Users.users, function(i, user) {
			if (user.id() == root.user().id())
				IssueTracker.Utilities.copyNestedObservableObject(root.user, user);
		});
	}

	function _updateSignedInUser() {
		if (IssueTracker.signedInUser().id() != root.user().id())
			return;

		IssueTracker.Utilities.copyNestedObservableObject(root.user(), IssueTracker.signedInUser());
	}

})(root("IssueTracker.Users.EditUser"));