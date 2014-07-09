var Promise = require("bluebird");
var config = require("../../config");
var repositories = require("../repositories");

var repository = Object.spawn(require("./baseRepository"), {
	table: "issues"
});

repository.search = function(projectId, filter, sortDirection, sortComparer, start, end) {
	var query = this.connection()
		.select("issues.id", "issues.number", "issues.name", "issues.description", "issues.priorityId", "issues.developerId", "developers.name as developer", "issues.testerId")
//		.join("priorities", "issues.priorityId", "priorities.id")
//		.join("statuses", "issues.statusId", "statuses.id")
//		.join("milestones", "issues.milestoneId", "milestones.id")
//		.join("issuetypes", "issues.issueTypeId", "issuetypes.id")
		.join("users as developers", "issues.developerId", "developers.id")
//		.join("users as testers", "issues.testerId", "testers.id")
		.where({ "issues.projectId": projectId, "issues.isDeleted": false });

//	if (filter.milestones.length > 0)
//		query = query.whereIn("issues.milestoneId", filter.milestones);
//	if (filter.priorities.length > 0)
//		query = query.whereIn("issues.priorityId", filter.priorities);
//	if (filter.statuses.length > 0)
//		query = query.whereIn("issues.statusId", filter.statuses);
//	if (filter.types.length > 0)
//		query = query.whereIn("issues.issueTypeId", filter.types);
//	if (filter.developers.length > 0)
//		query = query.whereIn("issues.developerId", filter.developers);
//	if (filter.testers.length > 0)
//		query = query.whereIn("issues.testerId", filter.testers);

	query = query
		.offset(start - 1)
		.limit(end - start + 1);
	console.log(query.toString());
	return query;

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

repository.number = function(projectId, id) {
	return this.connection()
		.select("issues.*", "milestones.name as milestone", "priorities.name as priority", "statuses.name as status", "developers.name as developer", "testers.name as tester", "issuetypes.name as issueType")
		.join("priorities", "issues.priorityId", "priorities.id")
		.join("statuses", "issues.statusId", "statuses.id")
		.join("milestones", "issues.milestoneId", "milestones.id")
		.join("issuetypes", "issues.issueTypeId", "issuetypes.id")
		.join("users as developers", "issues.developerId", "developers.id")
		.join("users as testers", "issues.testerId", "testers.id")
		.where({ "issues.projectId": projectId, "issues.id": id })
		.limit(1)
		.then(function(issues) {
			return issues[0];
		});
};

repository.updateIssue = function(model, user) {
	var repositories = require("../repositories"), that = this;
	return Promise.all([
		this.connection().where({ id: model.id }).then(function(issues) { return issues[0]; }),
		repositories.Milestone.details(model.milestoneId),
		repositories.Priority.details(model.priorityId),
		repositories.Status.details(model.statusId),
		repositories.IssueType.details(model.issueTypeId),
		repositories.User.details(model.developerId),
		repositories.User.details(model.testerId)
	]).spread(function(issue, milestone, priority, status, type, developer, tester) {
		issue.name = model.name;
		issue.description = model.description;
		issue.milestoneId = milestone.id;
		issue.priorityId = priority.id;
		issue.statusId = status.id;
		issue.issueTypeId = type.id;
		issue.developerId = developer.id;
		issue.testerId = tester.id;
		issue.closed = model.closed;
		issue.updated_at = new Date();
		return that.connection("issues").where({ id: issue.id }).update(issue);
	});
};

repository.getNextNumber = function(projectId) {
	return this.connection().select("id").where({ projectId: projectId }).limit(1).then(function(result) {
		return result[0].id+1;
	});
};

repository.issueCountsPerUser = function(projectId) {
	var result = {}, connection = this.connection();
	return require("./userRepository").get({ projectId: projectId }).then(function(users) {
		return Promise.all(users.map(function(user) {
			return _getCountsForUser(user, connection).spread(function(developerCount, testerCount) {
				result[user.id] = {
					developer: developerCount,
					tester: testerCount
				};
			});
		}));
	}).then(function() {
		return result;
	});

	function _getCountsForUser(user, connection) {
		return Promise.all([
			connection.where({ developerId: user.id }).count().then(function(result) { return parseInt(result[0].count); }),
			connection.where({ testerId: user.id }).count().then(function(result) { return parseInt(result[0].count); })
		]);
	}
};

module.exports = repository;