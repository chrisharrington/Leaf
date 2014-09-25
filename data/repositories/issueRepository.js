var Promise = require("bluebird");
var config = require("../../config");
var repositories = require("../repositories");

var repository = Object.spawn(require("./baseRepository"), {
	model: require("../models").Issue
});

repository.search = function(projectId, filter, sortDirection, sortComparer, start, end) {
	console.time("search");
	return repository.get(_buildParameters(projectId, filter), {
		sort: _buildSort(sortDirection, sortComparer),
		skip: start - 1,
		limit: end - start + 1,
		projection: {
			name: true,
			details: true,
			number: true,
			priorityId: true,
			developerId: true
		}
	}).then(function(issues) {
		console.timeEnd("search");
		return issues;
	});

	function _buildParameters(projectId, filter) {
		var params = {
			project: projectId,
			isDeleted: false,
			number: { $gt: 2 }
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
		issue.milestoneOrder = milestone.order;
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
	var result = {};
	var model = this.model;
	return require("./userRepository").get({ project: projectId }).then(function(users) {
		return Promise.all(users.map(function(user) {
			return _getCountsForUser(user, model).spread(function(developerCount, testerCount) {
				result[user._id] = {
					developer: developerCount,
					tester: testerCount
				};
			});
		}));
	}).then(function() {
		return result;
	});

	function _getCountsForUser(user, model) {
		return Promise.all([
			model.countAsync({ developerId: user._id }),
			model.countAsync({ testerId: user._id })
		]);
	}
};

module.exports = repository;