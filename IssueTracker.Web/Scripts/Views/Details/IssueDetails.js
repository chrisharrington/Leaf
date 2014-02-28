
(function (root) {

	var _container;
	var _oldName;
	var _detailsFlipper;
	var _transitioner = IssueTracker.Transitioner;
	var _deleter = root.Delete;

	root.saving = ko.observable(false);

	root.chooser = {
		template: ko.observable(),
		data: ko.observable()
	};

	root.init = function (container) {
		_container = container;
		_setUpFlipPanels(container);
		_hookupEvents(container);
		_transitioner.init();
		_deleter.init(container);
	};

	root.load = function () {
		_setNumberWidth();
		_detailsFlipper = new IssueTracker.Controls.Flipper("#choices-container");
		_oldName = IssueTracker.selectedIssue.description();
		
		IssueTracker.selectedIssue.statusId.subscribe(function (statusId) {
			_transitioner.execute(statusId);
		});
	};

	function _hookupEvents(container) {
		container.on("click", "#save-changes", _updateIssue);
		container.on("click", "div.transitions button", _executeTransition);
		container.on("click", "div.milestone-chooser>div", _setMilestone);
		container.on("click", "div.priority-chooser>div", _setPriority);
		container.on("click", "div.status-chooser>div", _setStatus);
		container.on("click", "div.developer-chooser>div", _setDeveloper);
		container.on("click", "div.tester-chooser>div", _setTester);
	}

	function _setMilestone() {
		_detailsFlipper.toggle();
		_container.find("div.milestone-chooser>div.selected").removeClass("selected");
		$(this).addClass("selected");

		var milestone = $.parseJSON($(this).attr("data-milestone"));
		IssueTracker.selectedIssue.milestoneId(milestone.id);
		IssueTracker.selectedIssue.milestone(milestone.name);
	}

	function _setPriority() {
		_detailsFlipper.toggle();
		_container.find("div.priority-chooser>div.selected").removeClass("selected");
		$(this).addClass("selected");

		var priority = $.parseJSON($(this).attr("data-priority"));
		IssueTracker.selectedIssue.priorityId(priority.id);
		IssueTracker.selectedIssue.priority(priority.name);
	}

	function _setStatus() {
		_container.find("div.status-chooser>div.selected").removeClass("selected");
		$(this).addClass("selected");

		var status = $.parseJSON($(this).attr("data-status"));
		IssueTracker.selectedIssue.statusId(status.id);
		IssueTracker.selectedIssue.status(status.name);
		_detailsFlipper.toggle();
	}
	
	function _setDeveloper() {
		_detailsFlipper.toggle();
		_container.find("div.developer-chooser>div.selected").removeClass("selected");
		$(this).addClass("selected");

		var developer = $.parseJSON($(this).attr("data-developer"));
		IssueTracker.selectedIssue.developerId(developer.id);
		IssueTracker.selectedIssue.developer(developer.name);
	}
	
	function _setTester() {
		_detailsFlipper.toggle();
		_container.find("div.tester-chooser>div.selected").removeClass("selected");
		$(this).addClass("selected");

		var tester = $.parseJSON($(this).attr("data-tester"));
		IssueTracker.selectedIssue.testerId(tester.id);
		IssueTracker.selectedIssue.tester(tester.name);
	}

	function _executeTransition() {
		_transitioner.execute($(this).attr("data-status-id"));
	}

	function _setUpFlipPanels(container) {
		container.on("click", "#milestone", function () {
			root.chooser.data({ milestones: IssueTracker.milestones() });
			root.chooser.template("milestone-chooser");
			_detailsFlipper.toggle();
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
		
		container.on("click", "#developer", function () {
			root.chooser.data({ developers: IssueTracker.users() });
			root.chooser.template("developer-chooser");
			_detailsFlipper.toggle();
		});
		
		container.on("click", "#tester", function () {
			root.chooser.data({ testers: IssueTracker.users() });
			root.chooser.template("tester-chooser");
			_detailsFlipper.toggle();
		});
	};

	function _updateIssue() {
		root.saving(true);
		return $.post(IssueTracker.virtualDirectory() + "Issues/Update", _buildIssueParameters()).done(function() {
			window.location.hash = window.location.hash.replace(_oldName.formatForUrl(), IssueTracker.selectedIssue.description().formatForUrl());
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while saving your issue. Please try again later.");
		}).always(function() {
			root.saving(false);
		});
	}

	function _buildIssueParameters() {
		var issue = IssueTracker.selectedIssue;
		return {
			id: issue.id(),
			number: issue.number(),
			description: issue.description(),
			details: issue.details(),
			milestoneId: issue.milestoneId(),
			priorityId: issue.priorityId(),
			statusId: issue.statusId(),
			developerId: issue.developerId(),
			testerId: issue.testerId(),
			opened: issue.opened(),
			closed: issue.closed()
		};
	}

	function _setNumberWidth() {
		var number = _container.find("h1.number");
		var padding = parseInt(number.css("padding-left").replace("px", "")) * 2;
		var width = 13 + IssueTracker.selectedIssue.number().toString().length * 12;
		number.width(width).parent().find("div.description").css({ "padding-left": width + padding + 1 });
	}

	IssueTracker.Page.build({
		root: root,
		view: function () { return "Issues/Details?issueName=:name&projectId=" + IssueTracker.selectedProject().id; },
		title: "Issue Details",
		route: "#/:project-name/issues/:name",
		style: "issue-details-container"
	});

})(root("IssueTracker.IssueDetails"));
