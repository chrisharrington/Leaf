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

repository.update = function(model) {
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
		for (var name in model)
			if (issue[name] != undefined)
				issue[name] = model[name];
		issue.milestone = milestone.name;
		issue.priority = priority.name;
		issue.status = status.name;
		issue.type = type.name;
		issue.developer = developer.name;
		issue.tester = tester.name;
		Promise.promisifyAll(issue).saveAsync();
	});
};

repository.create = function(model) {
	return this.model.createAsync(model);
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