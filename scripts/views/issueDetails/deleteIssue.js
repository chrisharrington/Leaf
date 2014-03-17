
(function (root) {

	root.loading = ko.observable(false);

	root.init = function() {
		$(document).on("click", "#delete-issue", _delete);
		$(document).on("click", "#confirm-delete", _submit);
		$(document).on("click", "#cancel-delete", IssueTracker.Dialog.hide);
	};
	
	function _delete() {
		IssueTracker.Dialog.load("#confirm-delete", root);
	}
	
	function _submit() {
		root.loading(true);
		$.post(IssueTracker.virtualDirectory() + "Issues/Delete", IssueTracker.Utilities.extractPropertyObservableValues(IssueTracker.selectedIssue)).done(function() {
			IssueTracker.Issues.navigate({ "project-name": IssueTracker.selectedProject().name.formatForUrl() });
			IssueTracker.Dialog.hide();
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while deleting this issue. Please try again later.");
		}).always(function() {
			root.loading(false);
		});
	}

})(root("IssueTracker.IssueDetails.Delete"));
