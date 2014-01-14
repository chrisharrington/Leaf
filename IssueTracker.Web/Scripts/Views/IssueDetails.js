
(function (root) {

	root.load = function (container) {
		
	};

	IssueTracker.Page.build({
		root: root,
		view: function() { return "Issues/Details?issueId=" + IssueTracker.selectedIssue().id; },
		title: "Issue Details",
		route: "#/issues/:name",
		style: "issue-details-container"
	});

})(root("IssueTracker.IssueDetails"));
