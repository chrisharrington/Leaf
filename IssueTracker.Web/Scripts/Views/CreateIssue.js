
(function(root) {

	var _container;

	root.loading = ko.observable(false);

	root.init = function (container) {
		_container = container;
		_container = container;

		_hookupEvents();
	};

	root.load = function(container) {

	};

	function _hookupEvents() {
		
	}

	IssueTracker.Page.build({
		root: root,
		view: "Issues/Create",
		title: "Create Issue",
		route: "#/:project-name/issues/new",
		style: "create-issue-container"
	});

})(root("IssueTracker.CreateIssue"));