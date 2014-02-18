
(function (root) {

	var _container;
	var _oldDescription;
	var _oldName;
	var _descriptionFlipper;
	var _nameFlipper;
	var _detailsFlipper;
	var _transitioner = IssueTracker.Transitioner;

	root.chooser = {
		template: ko.observable(),
		data: ko.observable()
	};

	root.init = function () {
		_transitioner.init();
	};

	root.load = function (container) {
		_container = container;
		_descriptionFlipper = new IssueTracker.Controls.Flipper($("div.description div.flipper"));
		_nameFlipper = new IssueTracker.Controls.Flipper($("div.description.flipper"));
		_detailsFlipper = new IssueTracker.Controls.Flipper($("div.details-container>div.flipper"));

		_setUpFlipPanels(container);
		_hookupEvents(container);
		_transitioner.load(IssueTracker.selectedIssue.statusId());
	};

	function _hookupEvents(container) {
		container.on("click", "#save-description", _saveDescription);
		container.on("click", "#discard-description", _discardDescription);
		container.on("click", "div.transitions button", _executeTransition);
		container.on("click", "#save-description", _saveName);
		container.on("click", "#discard-description", _discardName);
		container.on("click", "div.priority-chooser>div", _setPriority);
		container.on("click", "div.status-chooser>div", _setStatus);
	}

	function _setPriority() {
		_detailsFlipper.toggle();
		_container.find("div.priority-chooser>div.selected").removeClass("selected");
		$(this).addClass("selected");

		var priority = $.parseJSON($(this).attr("data-priority"));
		IssueTracker.selectedIssue.priorityId(priority.id);
		IssueTracker.selectedIssue.priority(priority.name);

		_updateIssue();
	}

	function _setStatus() {
		_detailsFlipper.toggle();
		_container.find("div.status-chooser>div.selected").removeClass("selected");
		$(this).addClass("selected");

		var status = $.parseJSON($(this).attr("data-status"));
		IssueTracker.selectedIssue.statusId(status.id);
		IssueTracker.selectedIssue.status(status.name);
	}

	function _executeTransition() {
		_transitioner.execute($(this).attr("data-status-id"));
	}

	function _setUpFlipPanels(container) {
		container.on("click", "div.description div.front", function () {
			_oldDescription = IssueTracker.selectedIssue.description();
			_descriptionFlipper.toggle();
		});

		container.on("click", "div.description div.front", function () {
			_oldName = IssueTracker.selectedIssue.name();
			_nameFlipper.toggle();
		});

		container.on("click", "#priority", function () {
			root.chooser.data({ priorities: IssueTracker.priorities() });
			root.chooser.template("priority-chooser");
			_detailsFlipper.toggle();
		});

		container.on("click", "#status", function() {
			root.chooser.data({ statuses: IssueTracker.statuses() });
			root.chooser.template("status-chooser");
			_detailsFlipper.toggle();
		});
	};

	function _discardDescription() {
		_descriptionFlipper.toggle();
		IssueTracker.selectedIssue.description(_oldDescription);
	}

	function _saveDescription() {
		var loader = _container.find("div.description img").show();
		var buttons = _container.find("div.description button").attr("disabled", true);
		$.post(IssueTracker.virtualDirectory() + "Issues/UpdateDescription", { issueId: IssueTracker.selectedIssue.id(), description: IssueTracker.selectedIssue.description() }).done(function() {
			_descriptionFlipper.toggle();
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while updating the issue's description. Please try again later.");
		}).always(function() {
			loader.hide();
			buttons.attr("disabled", false);
		});
	}

	function _discardName() {
		_nameFlipper.toggle();
		IssueTracker.selectedIssue.name(_oldName);
	}

	function _saveName() {
		var buttons = _container.find("div.description button").attr("disabled", true);
		$.post(IssueTracker.virtualDirectory() + "Issues/UpdateName", { issueId: IssueTracker.selectedIssue.id(), name: IssueTracker.selectedIssue.name() }).done(function () {
			_nameFlipper.toggle();
			window.location.hash = window.location.hash.replace(_oldName.formatForUrl(), IssueTracker.selectedIssue.name().formatForUrl());
		}).fail(function () {
			IssueTracker.Feedback.error("An error has occurred while updating the issue's description. Please try again later.");
		}).always(function () {
			buttons.attr("disabled", false);
		});
	}

	function _updateIssue() {
		return $.post(IssueTracker.virtualDirectory() + "Issues/Update", _buildIssueParameters());
	}

	function _buildIssueParameters() {
		var issue = IssueTracker.selectedIssue;
		return {
			id: issue.id(),
			number: issue.number(),
			name: issue.name(),
			description: issue.description(),
			priorityId: issue.priorityId(),
			statusId: issue.statusId(),
			developerId: issue.developerId(),
			testerId: issue.testerId(),
			opened: issue.opened(),
			closed: issue.closed()
		};
	}

	IssueTracker.Page.build({
		root: root,
		view: function () { return "Issues/Details?issueName=:description&projectId=" + IssueTracker.selectedProject().id; },
		title: "Issue Details",
		route: "#/:project-description/issues/:description",
		style: "issue-details-container"
	});

})(root("IssueTracker.IssueDetails"));
