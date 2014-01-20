
(function (root) {

	var _container;
	var _oldDescription;
	var _descriptionFlipper;
	var _transitioner = IssueTracker.Transitioner;

	root.load = function (container) {
		_container = container;
		_descriptionFlipper = new IssueTracker.Controls.Flipper($("div.description div.flipper"));

		_setUpFlipPanels(container);
		_hookupEvents(container);
		_transitioner.load(IssueTracker.selectedIssue.statusId());
	};

	function _hookupEvents(container) {
		container.on("click", "#save-description", _saveDescription);
		container.on("click", "#cancel-description", _discardDescription);
		container.on("click", "div.transitions button", _executeTransition);
	}

	function _executeTransition() {
		_transitioner.execute($(this).attr("data-to-status-id"));
	}

	function _setUpFlipPanels(container) {
		container.on("click", "div.description div.front", function () {
			_oldDescription = IssueTracker.selectedIssue.description();
			_descriptionFlipper.toggle();
		});
	};

	function _discardDescription() {
		_descriptionFlipper.toggle();
		IssueTracker.selectedIssue.description(_oldDescription);
	}

	function _saveDescription() {
		var loader = _container.find("div.description img").show();
		var buttons = _container.find("div.description button").attr("disabled", true);

		$.post(IssueTracker.virtualDirectory() + "Issues/Update", _buildIssueParameters()).success(function() {
			_descriptionFlipper.toggle();
		}).error(function() {
			alert("An error has occurred while updating the issue's description. Please try again later.");
		}).complete(function() {
			loader.hide();
			buttons.attr("disabled", false);
		});
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
