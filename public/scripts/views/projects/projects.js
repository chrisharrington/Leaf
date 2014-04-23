
(function(root) {

	var _container;

	root.init = function(container) {
		_container = container;
	};

	root.load = function(container) {

	};

	$(function() {
		IssueTracker.Page.build({
			root: root,
			view: "projects",
			route: "#/projects",
			style: "projects-container"
		});
	});

})(root("IssueTracker.Projects"));