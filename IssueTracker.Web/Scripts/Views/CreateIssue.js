
(function(root) {

	var _container;

	root.loading = ko.observable(false);

	root.createModel = {
		description: ko.observable(""),
		comments: ko.observable("")
	};

	root.init = function (container) {
		_container = container;
		_container = container;

		_hookupEvents();
	};

	root.load = function() {

	};

	function _hookupEvents() {
		_container.on("click", "div.choice-tile>div", _toggleSelectedChoice);
	}

	function _toggleSelectedChoice() {
		$(this).closest("div.choice-tile").find(">div.selected").removeClass("selected");
		$(this).addClass("selected");
	}

	IssueTracker.Page.build({
		root: root,
		view: "Issues/Create",
		title: "Create Issue",
		route: "#/:project-name/issues/new",
		style: "create-issue-container"
	});

})(root("IssueTracker.CreateIssue"));