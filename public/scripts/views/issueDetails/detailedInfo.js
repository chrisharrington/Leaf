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

	root.togglePriorities = function() {
		_toggle("priorities");
	};

	root.toggleStatuses = function() {
		_toggle("statuses");
	};

	root.toggleIssueTypes = function() {
		_toggle("issueTypes");
	};

	root.toggleDevelopers = function() {
		_toggle("developers");
	};

	root.toggleTesters = function() {
		_toggle("testers");
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