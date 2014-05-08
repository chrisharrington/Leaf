
(function (root) {

	root.loading = ko.observable(false);
	root.password = ko.observable("");
	root.confirmed = ko.observable("");

	root.save = function() {
		alert("save");
	};

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
