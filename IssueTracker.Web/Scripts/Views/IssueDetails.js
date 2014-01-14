
(function (root) {

	root.load = function (container) {
		
	};

	IssueTracker.Page.build({
		root: root,
		view: function () { return "Issues/Details?issueName=:name&projectId=" + IssueTracker.selectedProject().Id; },
		title: "Issue Details",
		route: "#/issues/:name",
		style: "issue-details-container"
	});

})(root("IssueTracker.IssueDetails"));
