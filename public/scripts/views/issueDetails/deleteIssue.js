
(function (root) {

	root.loading = ko.observable(false);

	root.remove = function() {
		IssueTracker.Dialog.load("#confirm-delete", root);
	};

	root.restore = function() {
		root.loading(true);
		$.post(IssueTracker.virtualDirectory + "issues/undelete", { id: IssueTracker.selectedIssue.id }).done(function() {
			IssueTracker.Feedback.success("The issue has been restored.");
			IssueTracker.selectedIssue.isDeleted(false);
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while undeleting this issue. Please try again later.");
		}).always(function() {
			root.loading(false);
		});
	};

	root.confirm = function() {
		root.loading(true);
		$.post(IssueTracker.virtualDirectory + "issues/delete", { id: IssueTracker.selectedIssue.id }).done(function() {
			IssueTracker.Issues.navigate();
			IssueTracker.Dialog.hide();
			IssueTracker.Notifications.refresh();
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while deleting this issue. Please try again later.");
		}).always(function() {
			root.loading(false);
		});
	};

	root.cancel = function() {
		IssueTracker.Dialog.hide();
	};

})(root("IssueTracker.IssueDetails.Delete"));
