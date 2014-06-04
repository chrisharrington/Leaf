
(function(root) {

	var _container;
	var _redirect;

	root.newPasswordVisible = ko.observable(false);

	root.init = function(container) {
		_container = container;

		root.SignIn.init(container.find("div.sign-in"), function() {
			return _redirect;
		});

		root.newPasswordVisible.subscribe(function() {
			if (root.NewPassword.focusPassword)
				root.NewPassword.focusPassword(true);
		});
	};

	root.load = function(container, params) {
		_container.find("div.sign-in input:first").focus();
	};

	root.redirect = function() {
		_redirect = window.location.hash.substring(1);
		window.location.hash = "/welcome";
	};

	$(function() {
		IssueTracker.Page.build({
			root: root,
			view: "welcome",
			route: "#/welcome",
			style: "welcome-container",
			isAnonymous: true
		});
	});

})(root("IssueTracker.Welcome"));