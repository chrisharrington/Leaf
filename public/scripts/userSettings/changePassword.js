(function(root) {

	var _template;

	root.saving = ko.observable(false);
	root.loading = ko.observable(false);
	root.currentPassword = ko.observable("");
	root.newPassword = ko.observable("");
	root.confirmedPassword = ko.observable("");

	root.init = function(template) {
		_template = template;
	};

	root.show = function() {
		IssueTracker.Dialog.load(_template, root);
	};

	root.cancel = function() {
		IssueTracker.Dialog.hide();
	};

	root.save = function() {
		var error = _validate();
		if (error) {
			IssueTracker.Feedback.error(error);
			return;
		}

		_save();
	};

	function _validate() {
		if (!root.currentPassword() || root.currentPassword() == "")
			return "The current password is required.";
		if (!root.newPassword() || root.newPassword() == "")
			return "The new password is required.";
		if (!root.confirmedPassword() || root.confirmedPassword() == "")
			return "The confirmed password is required.";
		if (root.newPassword() != root.confirmedPassword())
			return "The new and confirmed passwords do not match.";
	}

	function _save() {
		root.saving(true);
		$.post(IssueTracker.virtualDirectory() + "users/change-password", {
			current: root.currentPassword(),
			password: root.newPassword(),
			confirmed: root.confirmedPassword()
		}).done(function() {
			IssueTracker.Feedback.success("Your password has been changed.");
			IssueTracker.Dialog.hide();
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while changing your password. Please try again later.");
		}).always(function() {
			root.saving(false);
		});
	}

})(root("IssueTracker.UserSettings.ChangePassword"));