var Promise = require("bluebird");
var config = require("../../config");
var mongojs = require("mongojs");

var repository = Object.spawn(require("./baseRepository"), {
	model: require("../models").Issue
});

repository.search = function(projectId, filter, sortDirection, sortComparer, start, end) {
	var db = mongojs(config.call(this, "databaseUser") + ":" + config.call(this, "databasePassword") + "@oceanic.mongohq.com:10038/issuetracker");
	var collection = db.collection("issues");

	return new Promise(function(resolve, reject) {
		collection.find({
			number: { $gte: 10 }
//			project: projectId,
//			isDeleted: false,
//			priorityId: { $in: filter.priorities }
//			statusId: { $in: filter.statuses },
//			developerId: { $in: filter.developers },
//			testerId: { $in: filter.testers },
//			milestoneId: { $in: filter.milestones},
//			typeId: { $in: filter.types }
		}).sort(_buildSort(sortDirection, sortComparer)).skip(start - 1).limit(end - start + 1, function(err, docs) {
			if (err) reject(err);
			else resolve(docs);
		});
	});

//	return repository.get({
//		project: projectId,
//		isDeleted: false,
//		priorityId: { $in: filter.priorities },
//		statusId: { $in: filter.statuses },
//		developerId: { $in: filter.developers },
//		testerId: { $in: filter.testers },
//		milestoneId: { $in: filter.milestones},
//		typeId: { $in: filter.types }
//	}, {
//		sort: _buildSort(sortDirection, sortComparer),
//		skip: start - 1,
//		limit: end - start + 1
//	});

	function _buildSort(direction, comparer) {
		if (comparer == "priority")
			comparer = "priorityOrder";
		else if (comparer == "status")
			comparer = "statusOrder";
		var sort = {};
		sort[comparer] = direction == "ascending" ? 1 : -1;
		sort.number = 1;
		return sort;
	}
};

repository.number = function(projectId, number) {
	return this.one({ project: projectId, number: number });
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
		issue.closed = model.closed;
		Promise.promisifyAll(issue).saveAsync();
	});
};

repository.getNextNumber = function(projectId) {
	return repository.one({ project: projectId }, { sort: { number: -1 }}).then(function(issue) {
		return issue.number + 1;
	});
};

repository.issueCountsPerUser = function(projectId) {
	var model = Promise.promisifyAll(this.model);
	return Promise.all([
		_getIssueCounts("$developerId", projectId, model),
		_getIssueCounts("$testerId", projectId, model)
	]).spread(function(developers, testers) {
		var result = {};
		developers.forEach(function(developerCount) {
			result[developerCount._id] = {
				developer: developerCount.count,
				tester: 0
			};
		});
		testers.forEach(function(testerCount) {
			if (!result[testerCount._id])
				result[testerCount._id] = { developer: 0 };
			result[testerCount._id].tester = testerCount.count;
		});
		return result;
	});

	function _getIssueCounts(property, projectId, model) {
		return model.aggregateAsync({ $match: { project: projectId }}, { $group: { _id: property, count: { $sum: 1 }}});
	}
};

module.exports = repository;