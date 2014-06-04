(function(root) {

	var _token;

	root.loading = ko.observable(false);
	root.focusEmail = ko.observable(false);
	root.email = ko.observable("");
	root.password = ko.observable("");
	root.confirmPassword = ko.observable("");

	root.load = function(container, routeArguments) {
		_token = routeArguments["token"];

		root.focusEmail(true);
	};

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
		$.post(IssueTracker.virtualDirectory + "new-password", { email: root.email(), token: _token, password: root.password() }).done(function() {
			IssueTracker.Feedback.success("Your password has been reset. Thanks!");
			IssueTracker.Issues.navigate();
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while resetting your password. Please try again later.");
		}).always(function() {
			root.loading(false);
		});
	}

	$(function() {
		IssueTracker.Page.build({
			root: root,
			view: "new-password",
			route: "#/new-password/:token",
			style: "new-password-container",
			isAnonymous: true
		});
	});

})(root("IssueTracker.NewPassword"));