
(function (root) {

	IssueTracker.Page.build({
		root: root,
		view: function() { return "Dashboard?merchantConfigurationId=" + IssueTracker.merchantConfiguration(); },
		title: "Dashboard",
		route: "#/dashboard",
		style: "dashboard-container"
	});

})(root("IssueTracker.Dashboard"));
