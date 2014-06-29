var Promise = require("bluebird");
var config = require("../../config");
var repositories = require("../repositories");

var repository = Object.spawn(require("./baseRepository"), {
	table: "issues'"
});

repository.search = function(projectId, filter, sortDirection, sortComparer, start, end) {
	return this.connection()
//		.join("priorities", "issues.priorityId", "priorities.id")
//		.join("statuses", "issues.statusId", "statuses.id")
//		.join("milestones", "issues.milestoneId", "milestones.id")
//		.join("issuetypes", "issues.issueTypeId", "issuetypes.id")
//		.join("users", "issues.developerId", "users.id")
//		.join("users", "issues.testerId", "users.id")
		.where({ projectId: projectId });

//	var params = _buildParameters(projectId, filter);
//	return repository.get(params, {
//		sort: _buildSort(sortDirection, sortComparer),
//		skip: start - 1,
//		limit: end - start + 1
//	}).then(function(issues) {
//		return issues;
//	});

	function _buildParameters(projectId, filter) {
		var params = {
			project: projectId,
			isDeleted: false
		};
		_addFilter("priorityId", filter.priorities, params);
		_addFilter("statusId", filter.statuses, params);
		_addFilter("developerId", filter.developers, params);
		_addFilter("testerId", filter.testers, params);
		_addFilter("milestoneId", filter.milestones, params);
		_addFilter("typeId", filter.types, params);
		return params;
	}

	function _addFilter(idProperty, collection, params) {
		if (collection.length > 0)
			params[idProperty] = { $in: collection };
	}

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

repository.updateIssue = function(model, user) {
	var repositories = require("../repositories");
	return Promise.all([
		repository.details(model.id),
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
		issue.updatedById = user.id;
		issue.updatedBy = user.name;
		issue.milestoneId = milestone.id;
		issue.milestone = milestone.name;
		issue.milestoneOrder = milestone.order;
		issue.priorityId = priority.id;
		issue.priority = priority.name;
		issue.priorityOrder = priority.order;
		issue.statusId = status.id;
		issue.status = status.name;
		issue.statusOrder = status.order;
		issue.typeId = type.id;
		issue.type = type.name;
		issue.developerId = developer.id;
		issue.developer = developer.name;
		issue.testerId = tester.id;
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
	var result = {};
	return require("./userRepository").get({ project: projectId }).then(function(users) {
		return Promise.all(users.map(function(user) {
			return _getCountsForUser(user).spread(function(developerCount, testerCount) {
				result[user.id] = {
					developer: developerCount,
					tester: testerCount
				};
			});
		}));
	}).then(function() {
		return result;
	});

	function _getCountsForUser(user) {
		var connection = this.connection();
		return Promise.all([
			connection.where({ developerId: user.id }),
			connection.where({ testerId: user.id })
		]);
	}
};

module.exports = repository;