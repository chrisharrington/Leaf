
(function(root) {

	var _container;

	root.loading = ko.observable(false);

	root.createModel = {
		description: ko.observable(""),
		comments: ko.observable(""),
		priorityId: function () { return _getSelectedFromChoiceTile($("div.priority")); },
		statusId: function () { return _getSelectedFromChoiceTile($("div.status")); },
		developerId: function () { return _getSelectedFromChoiceTile($("div.developer")); },
		testerId: function () { return _getSelectedFromChoiceTile($("div.tester")); },
		milestoneId: function () { return _getSelectedFromChoiceTile($("div.milestone")); },
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
		_container.on("click", "#save", _save);
		_container.on("click", "#discard", _discard);
	}

	function _discard() {
		IssueTracker.Issues.navigate({ "project-name": IssueTracker.selectedProject().name.formatForUrl() });
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
		if (model.description() == "")
			return "The description is required.";
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
			IssueTracker.Feedback.success("Your issue has been created.");
			IssueTracker.Issues.navigate({ "project-name": IssueTracker.selectedProject().name.formatForUrl() });
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while creating your issue. Please try again later.");
		}).always(function() {
			root.loading(false);
		});
	}

	function _toggleSelectedChoice() {
		$(this).closest("div.choice-tile").find(">div.selected").removeClass("selected");
		$(this).addClass("selected");
	}

	function _getSelectedFromChoiceTile(tile) {
		return tile.find("div.selected").attr("data-id");
	}

	IssueTracker.Page.build({
		root: root,
		view: "Issues/Create",
		title: "Create Issue",
		route: "#/:project-name/new-issue",
		style: "create-issue-container"
	});

})(root("IssueTracker.CreateIssue"));