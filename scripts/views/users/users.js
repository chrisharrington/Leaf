
(function (root) {
	
	IssueTracker.Page.build({
		root: root,
		view: "Users",
		title: "Users",
		route: "#/:project-name/users",
		style: "users-container"
	});

})(root("IssueTracker.Users"));
