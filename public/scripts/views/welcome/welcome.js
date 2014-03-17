
(function(root) {

	var _container;

	root.init = function(container) {
		_container = container;

		root.SignIn.init(container.find("div.sign-in"));
	};

	root.load = function() {
		_container.find("div.sign-in input:first").focus();
	};

	IssueTracker.Page.build({
		root: root,
		view: "Welcome/Index",
		title: "Welcome",
		route: "#/welcome",
		style: "welcome-container",
		isAnonymous: true
	});

})(root("IssueTracker.Welcome"));