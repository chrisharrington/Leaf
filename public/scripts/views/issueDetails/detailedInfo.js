(function(root) {

	root.milestonesVisible = ko.observable(false);
	root.prioritiesVisible = ko.observable(false);
	root.statusesVisible = ko.observable(false);
	root.developersVisible = ko.observable(false);
	root.testersVisible = ko.observable(false);
	root.issueTypesVisible = ko.observable(false);

	root.toggleMilestones = function() {
		_toggle("milestones");
	};

	root.selectMilestone = function(milestone) {
		IssueTracker.selectedIssue.milestoneId(milestone.id());
		IssueTracker.selectedIssue.milestone(milestone.name());
		root.toggleMilestones();
	};

	root.togglePriorities = function() {
		_toggle("priorities");
	};

	root.selectPriority = function(priority) {
		IssueTracker.selectedIssue.priorityId(priority.id());
		IssueTracker.selectedIssue.priority(priority.name());
		root.togglePriorities();
	};

	root.toggleStatuses = function() {
		_toggle("statuses");
	};

	root.selectStatus = function(status) {
		IssueTracker.selectedIssue.statusId(status.id());
		IssueTracker.selectedIssue.status(status.name());
		root.toggleStatuses();
	};

	root.toggleIssueTypes = function() {
		_toggle("issueTypes");
	};

	root.selectIssueType = function(type) {
		IssueTracker.selectedIssue.typeId(type.id());
		IssueTracker.selectedIssue.type(type.name());
		root.toggleIssueTypes();
	};

	root.toggleDevelopers = function() {
		_toggle("developers");
	};

	root.selectDeveloper = function(developer) {
		IssueTracker.selectedIssue.developerId(developer.id());
		IssueTracker.selectedIssue.developer(developer.name());
		root.toggleDevelopers();
	};

	root.toggleTesters = function() {
		_toggle("testers");
	};

	root.selectTester = function(tester) {
		IssueTracker.selectedIssue.testerId(tester.id());
		IssueTracker.selectedIssue.tester(tester.name());
		root.toggleTesters();
	};

	function _toggle(property) {
		$.each(["milestones", "priorities", "statuses", "issueTypes", "developers", "testers"], function(i, current) {
			if (property != current)
				root[current + "Visible"](false);
		});

		property += "Visible";
		root[property](!root[property]());
	}

})(root("IssueTracker.IssueDetails.DetailedInfo"));