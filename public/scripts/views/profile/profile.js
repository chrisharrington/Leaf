
(function (root) {

	root.loading = ko.observable(false);
	root.password = ko.observable("");
	root.confirmed = ko.observable("");

	root.save = function() {
		var error = _validate();
		if (error)
			IssueTracker.Feedback.error(error);
		else {
			var user = IssueTracker.Utilities.extractPropertyObservableValues(IssueTracker.signedInUser());
			if (root.password() != "")
				user.password = root.password();
			_send(user);
		}
	};

	function _send(user) {
		root.loading(true);
		$.post(IssueTracker.virtualDirectory + "users/profile", user).done(function() {
			IssueTracker.Feedback.success("Your profile has been updated.");
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while updating your profile. Please try again later.");
		}).always(function() {
			root.loading(false);
		});
	}

	function _validate() {
		var user = IssueTracker.signedInUser();
		if (user.name() == "")
			return "Your name is required.";
		if (user.emailAddress() == "")
			return "Your email address is required.";
		if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(user.emailAddress()))
			return "Your email address is invalid.";

		var password = root.password(), confirmed = root.confirmed();
		if ((password != "" || confirmed != "") && password != confirmed)
			return "Your passwords don't match.";
	}

	$(function() {
		IssueTracker.Page.build({
			root: root,
			view: "users/profile",
			title: "Leaf - Profile",
			route: "#/profile",
			style: "profile-container"
		});
	});

})(root("IssueTracker.Profile"));
