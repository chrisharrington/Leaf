var Promise = require("bluebird");

var repository = Object.spawn(require("./baseRepository"), {
	model: require("../models").Issue
});

repository.search = function(filter, sortDirection, sortComparer, start, end) {
	return repository.get({
		isDeleted: false,
		priorityId: { $in: filter.priorities },
		statusId: { $in: filter.statuses },
		developerId: { $in: filter.developers },
		testerId: { $in: filter.testers },
		milestoneId: { $in: filter.milestones},
		typeId: { $in: filter.types },
	}, {
		//where: _buildFilters(filter),
		sort: _buildSort(sortDirection, sortComparer),
		skip: start - 1,
		limit: end - start + 1
	});

	function _buildSort(direction, comparer) {
		if (comparer == "priority")
			comparer = "priorityOrder";
		else if (comparer == "status")
			comparer = "statusOrder";
		var sort = {};
		sort[comparer] = direction == "ascending" ? 1 : -1;
		sort.opened = 1;
		return sort;
	}
};

repository.number = function(projectId, number) {
	var me = this;
	return me.model.findOneAsync({ project: projectId, number: number }).catch(function(e) {
		console.log("Error in issueRepository.number: " + e);
	});
};

repository.update = function(model, user) {
	var repositories = require("../repositories");
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