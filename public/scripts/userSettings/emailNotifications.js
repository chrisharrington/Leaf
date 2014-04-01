(function(root) {

	var _template;

	root.saving = ko.observable(false);

	root.init = function(template, trigger) {
		_template = template;

		$(trigger).on("click", _load);

		$(document).on("click", "div.email-notifications-dialog button.save", _save);
		$(document).on("click", "div.email-notifications-dialog button.cancel", function() { IssueTracker.Dialog.hide(); });
	};

	root.toggle = function(setting) {
		var on = IssueTracker.signedInUser()[setting]();
		IssueTracker.signedInUser()[setting](!on);
	};

	function _load() {
		IssueTracker.Dialog.load(_template);
	}

	function _save() {
		root.saving(true);
		$.post(IssueTracker.virtualDirectory() + "notifications/email", {
			emailNotificationForIssueAssigned: IssueTracker.signedInUser().emailNotificationForIssueAssigned(),
			emailNotificationForIssueDeleted: IssueTracker.signedInUser().emailNotificationForIssueDeleted(),
			emailNotificationForIssueUpdated: IssueTracker.signedInUser().emailNotificationForIssueUpdated(),
			emailNotificationForNewCommentForAssignedIssue: IssueTracker.signedInUser().emailNotificationForNewCommentForAssignedIssue
		}).done(function() {
			IssueTracker.Feedback.success("Your email notification settings have been updated.");
			IssueTracker.Dialog.hide();
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while updating your email notification settings. Please try again later.");
		}).always(function() {
			root.saving(false);
		});
	}

})(root("IssueTracker.UserSettings.EmailNotifications"));