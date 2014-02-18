
(function(root) {

	var _container;

	root.loading = ko.observable(false);

	root.createModel = {
		name: ko.observable(""),
		description: ko.observable(""),
		priorityId: function () { return _container.find("div.priority.padded-tile-container div.selected").attr("data-priority-id"); },
		statusId: function () { return _container.find("div.status.padded-tile-container div.selected").attr("data-status-id"); },
		developerId: function () { return _container.find("div.developer.padded-tile-container div.selected").attr("data-developer-id"); },
		testerId: function () { return _container.find("div.tester.padded-tile-container div.selected").attr("data-tester-id"); },
		milestoneId: function () { return _container.find("div.milestone.padded-tile-container div.selected").attr("data-milestone-id"); }
	};

	root.init = function (container) {
		_container = container;
		_container = container;

		_hookupEvents();
	};

	root.load = function() {
		_container.find("input.tile.container:first").focus();
	};

	function _hookupEvents() {
		_container.on("click", "div.choice-tile>div", _toggleSelectedChoice);
		_container.on("click", "#save", _save);
	}

	function _toggleSelectedChoice() {
		$(this).closest("div.choice-tile").find(">div.selected").removeClass("selected");
		$(this).addClass("selected");
	}

	function _save() {
		var error = _validate();
		if (error) {
			IssueTracker.Feedback.error(error);
			return;
		}

		_submit();
	}

	function _validate() {
		var model = root.createModel;
		if (model.name() == "")
			return "The issue description is required.";
		if (!model.priorityId())
			return "The priority is required.";
		if (!model.statusId())
			return "The status is required.";
		if (!model.developerId())
			return "The developer is required.";
		if (!model.testerId())
			return "The tester is required.";
		if (!model.milestoneId())
			return "The milestone is required.";
	}

	function _submit() {
		root.loading(true);

		$.post(IssueTracker.virtualDirectory() + "Issues/Create", IssueTracker.Utilities.extractPropertyObservableValues(root.createModel)).done(function () {
			alert("success");
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while creating your issue. Please try again later.");
		}).always(function() {
			root.loading(false);
		});
	}

	IssueTracker.Page.build({
		root: root,
		view: "Issues/Create",
		title: "Create Issue",
		route: "#/:project-description/issues/new",
		style: "create-issue-container"
	});

})(root("IssueTracker.CreateIssue"));