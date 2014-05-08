
(function (root) {

	root.password = ko.observable("");
	root.confirmed = ko.observable("");

	$(function() {
		IssueTracker.Page.build({
			root: root,
			view: "users/profile",
			title: "Leaf - User Profile",
			route: "#/profile",
			style: "profile-container"
		});
	});

})(root("IssueTracker.Profile"));
