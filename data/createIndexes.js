require("../extensions/string");
require("../extensions/number");
require("../extensions/array");
require("../inheritance");

var Promise = require("bluebird");
var repositories = require("./repositories");
var config = require("../config");
var schemaBuilder = require("./schemaBuilder");
var elasticsearch = require("elasticsearch");
var client = new elasticsearch.Client({
	host: config.call(this, "databaseLocation")
});

var project = { name: "Leaf", formattedName: "leaf", id: 1 };
schemaBuilder.build(project.id).then(function() {
	return client.indices.delete({ index: "*" });
}).then(function() {
	return client.indices.create({ index: project.id });
}).then(function() {
	return repositories.Project.create(project).then(function () {
		return Promise.all([
			_insertDefaultUsers(project),
			_insertDefaultPermissions(),
			_insertDefaultMilestones(project),
			_insertDefaultPriorities(project),
			_insertDefaultStatuses(project),
			_insertDefaultIssueTypes(project)
		]);
	});
}).spread(function(users, permissions) {
	return _createUserPermissions(project, users, permissions);
}).then(function () {
	console.log("Done!");
	process.exit(0);
});

function _createUserPermissions(project, users, permissions) {
	var inserts = [], count = 1;
	users.forEach(function(user) {
		permissions.forEach(function(permission) {
			inserts.push(repositories.UserPermission.create({ id: count++, userId: user.id, permissionId: permission.id }, project))
		});
	});
	return Promise.all(inserts);
}

function _insertDefaultMilestones(project) {
	var repo = repositories.Milestone;
	return Promise.all([
		repo.create({ id: 1, name: "Backlog", order: 1, projectId: project.id }, project),
		repo.create({ id: 2, name: "Version 1", order: 2, projectId: project.id }, project),
		repo.create({ id: 3, name: "Version 2", order: 3, projectId: project.id }, project)
	]);
}

function _insertDefaultPriorities(project) {
	var repo = repositories.Priority;
	return Promise.all([
		repo.create({ id: 1, name: "Critical", order: 1, colour: "#CF3A3C", projectId: project.id }, project),
		repo.create({ id: 2, name: "High", order: 2, colour: "#F27B1A", projectId: project.id }, project),
		repo.create({ id: 3, name: "Medium", order: 3, colour: "#EEB838", projectId: project.id }, project),
		repo.create({ id: 4, name: "Low", order: 4, colour: "#5295A5", projectId: project.id }, project)
	]);
}

function _insertDefaultStatuses(project) {
	var repo = repositories.Status;
	return Promise.all([
		repo.create({ id: 1, name: "Pending Development", order: 1, isDeveloperStatus: true, projectId: project.id }, project),
		repo.create({ id: 2, name: "In Development", order: 2, isDeveloperStatus: true, projectId: project.id }, project),
		repo.create({ id: 3, name: "Pending Testing", order: 3, isTesterStatus: true, projectId: project.id }, project),
		repo.create({ id: 4, name: "In Testing", order: 4, isTesterStatus: true, projectId: project.id }, project),
		repo.create({ id: 5, name: "Failed Testing", order: 5, isDeveloperStatus: true, projectId: project.id }, project),
		repo.create({ id: 6, name: "Complete", order: 6, isClosedStatus: true, projectId: project.id }, project)
	]);
}

function _insertDefaultIssueTypes(project) {
	var repo = repositories.IssueType;
	return Promise.all([
		repo.create({ id: 1, name: "Defect", projectId: project.id }, project),
		repo.create({ id: 2, name: "Feature", projectId: project.id }, project),
		repo.create({ id: 3, name: "Investigation", projectId: project.id }, project)
	]);
}

function _insertDefaultUsers(project) {
	var repo = repositories.User;
	return Promise.all([
		repo.create({
			id: 1,
			name: "Chris Harrington",
			emailAddress: "chrisharrington99@gmail.com",
			newPasswordToken: "token",
			projectId: project.id
		}, project)
	]);
}

function _insertDefaultPermissions() {
	var repo = repositories.Permission;
	return Promise.all([
		repo.create({ id: 1, name: "Create an Issue", tag: "create-issue" }),
		repo.create({ id: 2, name: "Edit an Issue", tag: "edit-issue" }),
		repo.create({ id: 3, name: "Delete an Issue", tag: "delete-issue" }),
		repo.create({ id: 4, name: "Create a User", tag: "create-user" }),
		repo.create({ id: 5, name: "Edit a User", tag: "edit-user" }),
		repo.create({ id: 6, name: "Delete a User", tag: "delete-user" }),
		repo.create({ id: 7, name: "Modify User Permissions", tag: "modify-user-permissions" }),
		repo.create({ id: 8, name: "Reset a User's Password", tag: "reset-password" })
	]);
}