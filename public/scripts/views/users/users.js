
(function (root) {

	$(function() {
		IssueTracker.Page.build({
			root: root,
			view: "users",
			title: "Leaf - Users",
			route: "#/:project-name/users",
			style: "users-container"
		});
	});

})(root("IssueTracker.Users"));
