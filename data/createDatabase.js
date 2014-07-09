require("../extensions/string");
require("../extensions/number");
require("../extensions/array");
require("../inheritance");

var Promise = require("bluebird");
var repositories = require("./repositories");
var testIssueCount = 10;

require("./connection").open().then(function(connection) {
	return require("./tableBuilder")(connection).then(function() {
		console.log("Tables built.");

		return _createProject().then(function (projectId) {
			return Promise.all([
				_insertDefaultUsers(projectId),
				_insertDefaultPermissions(),
				_insertDefaultMilestones(projectId),
				_insertDefaultPriorities(projectId),
				_insertDefaultStatuses(projectId),
				_insertDefaultIssueTypes(projectId)
			]);
		}).spread(function (userIds, permissionIds) {
			return Promise.all([
				_insertUserPermissions(userIds, permissionIds),
				_insertTestIssues(projectId)
			]);
		}).then(function () {
			console.log("Done.");
			process.exit(0);
		});
	});
}).catch(function(e) {
	console.log(e.stack);
});

function _insertTestIssues(projectId) {
	for (var i = 0; i < testIssueCount; i++)

}

function _buildIssue(projectId, index) {
	return {
		id: index+1,
		number: index+1,
		name: "test issue name",
		description: "test issue description",
		isDeleted: false,
		closed: null,
		priorityId: 1
	}
}

function _random(max) {
	return Math.random()
}

function _insertUserPermissions(userIds, permissionIds) {
	var inserts = [];
	userIds.forEach(function(userId) {
		permissionIds.forEach(function(permissionId) {
			inserts.push(repositories.UserPermission.create({ userId: userId, permissionId: permissionId }))
		});
	});
	return Promise.all(inserts);
}

function _removeAll(table) {
	return require("./connection").connection.schema.raw("DELETE FROM \"" + table + "\"");
}

function _createProject() {
	return _removeAll("projects").then(function() {
		return repositories.Project.create({ name: "Leaf", formattedName: "leaf" });
	});
}

function _insertDefaultMilestones(projectId) {
	var repo = repositories.Milestone;
	return _removeAll("milestones").then(function() {
		return Promise.all([
			repo.create({ name: "Backlog", order: 1, projectId: projectId }),
			repo.create({ name: "Version 1", order: 2, projectId: projectId }),
			repo.create({ name: "Version 2", order: 3, projectId: projectId })
		]);
	});
}

function _insertDefaultPriorities(projectId) {
	var repo = repositories.Priority;
	return _removeAll("priorities").then(function() {
		return Promise.all([
			repo.create({ name: "Critical", order: 1, colour: "#CF3A3C", projectId: projectId }),
			repo.create({ name: "High", order: 2, colour: "#F27B1A", projectId: projectId }),
			repo.create({ name: "Medium", order: 3, colour: "#EEB838", projectId: projectId }),
			repo.create({ name: "Low", order: 4, colour: "#5295A5", projectId: projectId })
		]);
	});
}

function _insertDefaultStatuses(projectId) {
	var repo = repositories.Status;
	return _removeAll("statuses").then(function() {
		return Promise.all([
			repo.create({ name: "Pending Development", order: 1, isDeveloperStatus: true, projectId: projectId }),
			repo.create({ name: "In Development", order: 2, isDeveloperStatus: true, projectId: projectId }),
			repo.create({ name: "Pending Testing", order: 3, isTesterStatus: true, projectId: projectId }),
			repo.create({ name: "In Testing", order: 4, isTesterStatus: true, projectId: projectId }),
			repo.create({ name: "Failed Testing", order: 5, isDeveloperStatus: true, projectId: projectId }),
			repo.create({ name: "Complete", order: 6, isClosedStatus: true, projectId: projectId })
		]);
	});
}

function _insertDefaultIssueTypes(projectId) {
	var repo = repositories.IssueType;
	return _removeAll("issuetypes").then(function() {
		return Promise.all([
			repo.create({ name: "Defect", projectId: projectId }),
			repo.create({ name: "Feature", projectId: projectId }),
			repo.create({ name: "Investigation", projectId: projectId })
		]);
	});
}

function _insertDefaultUsers(projectId) {
	var repo = repositories.User;
	return _removeAll("users").then(function() {
		return Promise.all([
			repo.create({
				name: "Chris Harrington",
				emailAddress: "chrisharrington99@gmail.com",
				password: "720f4e4f13581736a93944bce47075738afc5442e20ec743ce59210681f4bc799421dabcd480665b5b624646cdbd9ff5a626deb053fc1d53ba5fbde27bf9030b",
				salt: "qcmu8psnk58m6g104ad9d84xe",
				projectId: projectId
			})
		]);
	});
}

function _insertDefaultPermissions() {
	var repo = repositories.Permission;
	return _removeAll("permissions").then(function() {
		return Promise.all([
			repo.create({ name: "Create an Issue", tag: "create-issue" }),
			repo.create({ name: "Edit an Issue", tag: "edit-issue" }),
			repo.create({ name: "Delete an Issue", tag: "delete-issue" }),
			repo.create({ name: "Create a User", tag: "create-user" }),
			repo.create({ name: "Edit a User", tag: "edit-user" }),
			repo.create({ name: "Delete a User", tag: "delete-user" }),
			repo.create({ name: "Modify User Permissions", tag: "modify-user-permissions" }),
			repo.create({ name: "Reset a User's Password", tag: "reset-password" })
		]);
	});
}