
(function (root) {

	var _container;
	var _oldDescription;
	var _oldName;
	var _descriptionFlipper;
	var _nameFlipper;
	var _transitioner = IssueTracker.Transitioner;

	root.load = function (container) {
		_container = container;
		_descriptionFlipper = new IssueTracker.Controls.Flipper($("div.description div.flipper"));
		_nameFlipper = new IssueTracker.Controls.Flipper($("div.name.flipper"));
		
		_setUpFlipPanels(container);
		_setUpPropertyPopups(container);
		_hookupEvents(container);
		_transitioner.load(IssueTracker.selectedIssue.statusId());
	};

	function _hookupEvents(container) {
		container.on("click", "#save-description", _saveDescription);
		container.on("click", "#discard-description", _discardDescription);
		container.on("click", "div.transitions button", _executeTransition);
		container.on("click", "#save-name", _saveName);
		container.on("click", "#discard-name", _discardName);
	}

	function _executeTransition() {
		_transitioner.execute($(this).attr("data-status-id"));
	}

	function _setUpPropertyPopups(container) {
		container.find("#priority").click(function() {
			var popup = IssueTracker.Popup.load({ view: "#priority-filter-dialog", anchor: $(this), verticalOffset: 15 });
			popup.find(">div").click(function() {
				var priority = $.parseJSON($(this).find(">div").attr("data-priority"));
				IssueTracker.selectedIssue.priorityId(priority.Id);
				IssueTracker.selectedIssue.priority(priority.Name);
				IssueTracker.Popup.hide();
				_updateIssue();
			});
		});
	}

	function _setUpFlipPanels(container) {
		container.on("click", "div.description div.front", function () {
			_oldDescription = IssueTracker.selectedIssue.description();
			_descriptionFlipper.toggle();
		});

		container.on("click", "div.name div.front", function () {
			_oldName = IssueTracker.selectedIssue.name();
			_nameFlipper.toggle();
		});
	};

	function _discardDescription() {
		_descriptionFlipper.toggle();
		IssueTracker.selectedIssue.description(_oldDescription);
	}

	function _saveDescription() {
		var loader = _container.find("div.description img").show();
		var buttons = _container.find("div.description button").attr("disabled", true);
		_updateIssue().done(function() {
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
		var buttons = _container.find("div.name button").attr("disabled", true);
		_updateIssue().done(function () {
			_nameFlipper.toggle();
			window.location.hash = window.location.hash.replace(_oldName.formatForUrl(), IssueTracker.selectedIssue.name().formatForUrl());
		}).fail(function () {
			IssueTracker.Feedback.error("An error has occurred while updating the issue's name. Please try again later.");
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
			assigneeId: issue.assigneeId(),
			ownerId: issue.ownerId(),
			opened: issue.opened(),
			closed: issue.closed()
		};
	}

	IssueTracker.Page.build({
		root: root,
		view: function () { return "Issues/Details?issueName=:name&projectId=" + IssueTracker.selectedProject().id; },
		title: "Issue Details",
		route: "#/:project-name/issues/:name",
		style: "issue-details-container"
	});

})(root("IssueTracker.IssueDetails"));
