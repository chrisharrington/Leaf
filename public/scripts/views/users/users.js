
(function (root) {

	$(function() {
		IssueTracker.Page.build({
			root: root,
			view: "users",
			title: "Leaf - Users",
			route: "#/users",
			style: "users-container"
		});
	});

})(root("IssueTracker.Users"));
