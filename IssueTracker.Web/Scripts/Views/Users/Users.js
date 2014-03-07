
(function (root) {

	var _container;
	
	root.loading = ko.observable(true);

	root.init = function (container) {
		_container = container;
		_hookupEvents(container);
	};

	root.load = function () {
		
	};

	function _hookupEvents(container) {

	}

	IssueTracker.Page.build({
		root: root,
		view: "Users",
		title: "Users",
		route: "#/:project-name/users",
		style: "users-container"
	});

})(root("IssueTracker.Users"));
