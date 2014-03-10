
(function(root) {

	root.user = ko.observable();
	root.loading = ko.observable(false);

	root.delete = function (user) {
		root.user(user);
		IssueTracker.Dialog.load("confirm-delete-user-template", root);
	};

	root.confirm = function () {
		root.loading(true);
		$.post(IssueTracker.virtualDirectory() + "Users/Delete", root.user()).done(function() {
			IssueTracker.Feedback.success(root.user().name + " has been deleted.");
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while deleting the user. Please try again later.");
		}).always(function() {
			root.loading(false);
		});
	};

	root.cancel = function() {
		IssueTracker.Dialog.hide();
	};

})(root("IssueTracker.Users.DeleteUser"));