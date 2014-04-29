
(function(root) {

	var _container;
	var _getRedirect;

	root.loading = ko.observable(false);
	root.model = {
		email: ko.observable("chrisharrington99@gmail.com"),
		password: ko.observable("test"),
		staySignedIn: ko.observable(false)
	};

	root.init = function (container, getRedirect) {
		_container = container;
		_getRedirect = getRedirect;
	};

	root.signIn = function() {
		var error = _validate();
		if (error) {
			IssueTracker.Feedback.error(error);
			return;
		}

		_submit();
	};

	function _validate() {
		var model = root.model;
		if (model.email() == "")
			return "The email address is required.";
		if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(model.email()))
			return "The email address is invalid.";
		if (model.password() == "")
			return "The password is required.";
	}

	function _submit() {
		root.loading(true);
		$.post(IssueTracker.virtualDirectory() + "sign-in", IssueTracker.Utilities.extractPropertyObservableValues(root.model)).done(function (data) {
			IssueTracker.Utilities.setObservableProperties(data.user, IssueTracker.signedInUser());
			IssueTracker.projectId(data.project.id);
			IssueTracker.projectName(data.project.name);
			IssueTracker.signedInUser(IssueTracker.Utilities.createPropertyObservables(data.user));

			var redirect = _getRedirect();
			if (redirect)
				window.location.hash = redirect;
			else
				IssueTracker.Issues.navigate();
		}).fail(function (response) {
			if (response.status == 401)
				IssueTracker.Feedback.error("Your credentials are invalid.");
			else
				IssueTracker.Feedback.error("An error has occurred while signing you in. Please try again later.");
		}).always(function() {
			root.loading(false);
		});
	}

})(root("IssueTracker.Welcome.SignIn"));