var Promise = require("bluebird");

var repository = Object.spawn(require("./baseRepository"), {
	model: require("../models").Issue
});

repository.number = function(projectId, number) {
	var me = this;
	return me.model.findOneAsync({ project: projectId, number: number }).catch(function(e) {
		console.log("Error in issueRepository.number: " + e);
	});
};

repository.update = function(model, user) {
	var repositories = require("../repositories");
	var me = this;
	return Promise.all([
		repository.details(model._id),
		repositories.Milestone.details(model.milestoneId),
		repositories.Priority.details(model.priorityId),
		repositories.Status.details(model.statusId),
		repositories.IssueType.details(model.typeId),
		repositories.User.details(model.developerId),
		repositories.User.details(model.testerId)
	]).spread(function(issue, milestone, priority, status, type, developer, tester) {
        issue.name = model.name;
        issue.number = model.number;
        issue.details = model.details;
        issue.updatedById = user._id;
        issue.updatedBy = user.name;
        issue.milestoneId = milestone._id;
		issue.milestone = milestone.name;
        issue.priorityId = priority._id;
		issue.priority = priority.name;
        issue.priorityOrder = priority.order;
        issue.statusId = status._id;
		issue.status = status.name;
        issue.statusOrder = status.order;
        issue.typeId = type._id;
		issue.type = type.name;
        issue.developerId = developer._id;
		issue.developer = developer.name;
        issue.testerId = tester._id;
		issue.tester = tester.name;
        if (!issue.closed && issue.status.toLowerCase() == "closed")
            issue.closed = new Date();
		Promise.promisifyAll(issue).saveAsync();
	});
};

repository.getNextNumber = function(project) {
	var me = this;
	return new Promise(function(resolve, reject) {
		me.model.findOne().sort({ number: -1 }).exec(function(err, issue) {
			if (err) reject(err);
			else (resolve(issue.number+1));
		});
	});
};

module.exports = repository;