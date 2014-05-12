
(function (root) {

	root.base = IssueTracker.Project.Base;

	root.deleteMilestone = function() {
		IssueTracker.Dialog.load("delete-milestone-template", root);
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
