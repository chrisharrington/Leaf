(function (root) {

	root.load = function(container) {
		root.Milestone.sortable(container);
	};

	$(function() {
		IssueTracker.Page.build({
			root: root,
			view: "project/settings",
			title: "Leaf - Project Settings",
			route: "#/project/settings",
			style: "project-container"
		});
	});

})(root("IssueTracker.Project"));
