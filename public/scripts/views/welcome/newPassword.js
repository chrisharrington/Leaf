(function(root) {

	root.loading = ko.observable(false);
	root.focusPassword = ko.observable(false);
	root.password = ko.observable("");
	root.confirmPassword = ko.observable("");

	root.go = function() {
		var error = _validate();
		if (error) {
			IssueTracker.Feedback.error(error);
			return;
		}

		_submit();
	};

	function _validate() {
		var password = root.password(), confirmed = root.confirmPassword();
		if (!password || password == "")
			return "The password is required.";
		if (!confirmed || confirmed == "")
			return "The confirmed password is required.";
		if (password != confirmed)
			return "The password and confirmed password must match.";
	}

	function _submit() {
		root.loading(true);
		$.post(IssueTracker.virtualDirectory + "users/new-password", { userId: root.data.user.id, password: root.password() }).done(function() {
			IssueTracker.Feedback.success("Your password has been reset. Thanks!");
			IssueTracker.Welcome.SignIn.setSignInValues(root.data.user, root.data.project);
			IssueTracker.Welcome.newPasswordVisible(false);
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while resetting your password. Please try again later.");
		}).always(function() {
			root.loading(false);
		});
	}

})(root("IssueTracker.Welcome.NewPassword"));