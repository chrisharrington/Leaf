IssueTracker.IssueProperties = function() {
	this.milestonesVisible = ko.observable(false);
	this.prioritiesVisible = ko.observable(false);
	this.statusesVisible = ko.observable(false);
	this.developersVisible = ko.observable(false);
	this.testersVisible = ko.observable(false);
	this.issueTypesVisible = ko.observable(false);
};

IssueTracker.IssueProperties.prototype.reset = function() {
	this.milestonesVisible(false);
	this.prioritiesVisible(false);
	this.statusesVisible(false);
	this.developersVisible(false);
	this.testersVisible(false);
	this.issueTypesVisible(false);
};

IssueTracker.IssueProperties.prototype.toggleMilestones = function() {
	this._toggle("milestones");
};

IssueTracker.IssueProperties.prototype.selectMilestone = function(milestone) {
	this.issue.milestoneId(milestone.id());
	this.issue.milestone(milestone.name());
	this.toggleMilestones();
};

IssueTracker.IssueProperties.prototype.togglePriorities = function() {
	this._toggle("priorities");
};

IssueTracker.IssueProperties.prototype.selectPriority = function(priority) {
	this.issue.priorityId(priority.id());
	this.issue.priority(priority.name());
	this.togglePriorities();
};

IssueTracker.IssueProperties.prototype.toggleStatuses = function() {
	this._toggle("statuses");
};

IssueTracker.IssueProperties.prototype.selectStatus = function(status) {
	this.issue.statusId(status.id());
	this.issue.status(status.name());
	this.toggleStatuses();
};

IssueTracker.IssueProperties.prototype.toggleIssueTypes = function() {
	this._toggle("issueTypes");
};

IssueTracker.IssueProperties.prototype.selectIssueType = function(type) {
	this.issue.typeId(type.id());
	this.issue.type(type.name());
	this.toggleIssueTypes();
};

IssueTracker.IssueProperties.prototype.toggleDevelopers = function() {
	this._toggle("developers");
};

IssueTracker.IssueProperties.prototype.selectDeveloper = function(developer) {
	this.issue.developerId(developer.id());
	this.issue.developer(developer.name());
	this.toggleDevelopers();
};

IssueTracker.IssueProperties.prototype.toggleTesters = function() {
	this._toggle("testers");
};

IssueTracker.IssueProperties.prototype.selectTester = function(tester) {
	this.issue.testerId(tester.id());
	this.issue.tester(tester.name());
	this.toggleTesters();
};

IssueTracker.IssueProperties.prototype._toggle = function(property) {
	var that = this;
	$.each(["milestones", "priorities", "statuses", "issueTypes", "developers", "testers"], function(i, current) {
		if (property != current)
			that[current + "Visible"](false);
	});

	property += "Visible";
	this[property](!this[property]());
};