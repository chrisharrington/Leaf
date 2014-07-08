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
client.indices.delete({ index: "*" }).then(function() {
	return client.indices.create({ index: project.id });
}).then(function () {
	return schemaBuilder.build(project.id);
}).then(function() {
	return repositories.Project.create(project).then(function () {
		return Promise.all([
			_insertDefaultUsers(project),
			_insertDefaultPermissions(),
			_insertDefaultMilestones(project),
			_insertDefaultPriorities(project),
			_insertDefaultStatuses(project),
			_insertDefaultIssueTypes(project),
			_insertTestIssues(project)
		]);
	});
}).spread(function(users, permissions) {
	return _createUserPermissions(project, users, permissions);
}).then(function() {
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
		repo.create({ id: 1, name: "Backlog", order: 1, projectId: project.id, isDeleted: false }, project),
		repo.create({ id: 2, name: "Version 1", order: 2, projectId: project.id, isDeleted: false }, project),
		repo.create({ id: 3, name: "Version 2", order: 3, projectId: project.id, isDeleted: false }, project)
	]);
}

function _insertDefaultPriorities(project) {
	var repo = repositories.Priority;
	return Promise.all([
		repo.create({ id: 1, name: "Critical", order: 1, colour: "#CF3A3C", projectId: project.id, isDeleted: false }, project),
		repo.create({ id: 2, name: "High", order: 2, colour: "#F27B1A", projectId: project.id, isDeleted: false }, project),
		repo.create({ id: 3, name: "Medium", order: 3, colour: "#EEB838", projectId: project.id, isDeleted: false }, project),
		repo.create({ id: 4, name: "Low", order: 4, colour: "#5295A5", projectId: project.id, isDeleted: false }, project)
	]);
}

function _insertDefaultStatuses(project) {
	var repo = repositories.Status;
	return Promise.all([
		repo.create({ id: 1, name: "Pending Development", order: 1, isDeveloperStatus: true, projectId: project.id, isDeleted: false }, project),
		repo.create({ id: 2, name: "In Development", order: 2, isDeveloperStatus: true, projectId: project.id, isDeleted: false }, project),
		repo.create({ id: 3, name: "Pending Testing", order: 3, isTesterStatus: true, projectId: project.id, isDeleted: false }, project),
		repo.create({ id: 4, name: "In Testing", order: 4, isTesterStatus: true, projectId: project.id, isDeleted: false }, project),
		repo.create({ id: 5, name: "Failed Testing", order: 5, isDeveloperStatus: true, projectId: project.id, isDeleted: false }, project),
		repo.create({ id: 6, name: "Complete", order: 6, isClosedStatus: true, projectId: project.id, isDeleted: false }, project)
	]);
}

function _insertDefaultIssueTypes(project) {
	var repo = repositories.IssueType;
	return Promise.all([
		repo.create({ id: 1, name: "Defect", projectId: project.id, isDeleted: false }, project),
		repo.create({ id: 2, name: "Feature", projectId: project.id, isDeleted: false }, project),
		repo.create({ id: 3, name: "Investigation", projectId: project.id, isDeleted: false }, project)
	]);
}

function _insertDefaultUsers(project) {
	var repo = repositories.User;
	return Promise.all([
		repo.create({
			id: 1,
			name: "Chris Harrington",
			emailAddress: "chrisharrington99@gmail.com",
			newPasswordToken: null,
			projectId: 1,
			isDeleted: false,
			password: "52ebc02550eb78eb43a397871d104c7fcc9a165dcde566a3e2c7cf09d5c6c1da9f5dbe15624d71e25753218e10c0d16f4b8af20a58a87c677fdd92d458e39deb",
			identifier: "j5KA8GjWR-me2Hs30ZY5dg",
			salt: "awmthbh27wrt4w7dbwc4fq2gu",
			expiration: null,
			session: "up7nnjjvd5b68tl69lpzhbpuwyb3uk1hj12g0gbr4r4p3zzrj3wo9iaphl6zdp373e51did4zyi31cv24j82bj792mbbkaxdvq2h"
		}, project)
	]);
}

function _insertDefaultPermissions() {
	var repo = repositories.Permission;
	return Promise.all([
		repo.create({ id: 1, name: "Create an Issue", tag: "create-issue", isDeleted: false }),
		repo.create({ id: 2, name: "Edit an Issue", tag: "edit-issue", isDeleted: false }),
		repo.create({ id: 3, name: "Delete an Issue", tag: "delete-issue", isDeleted: false }),
		repo.create({ id: 4, name: "Create a User", tag: "create-user", isDeleted: false }),
		repo.create({ id: 5, name: "Edit a User", tag: "edit-user", isDeleted: false }),
		repo.create({ id: 6, name: "Delete a User", tag: "delete-user", isDeleted: false }),
		repo.create({ id: 7, name: "Modify User Permissions", tag: "modify-user-permissions", isDeleted: false }),
		repo.create({ id: 8, name: "Reset a User's Password", tag: "reset-password", isDeleted: false })
	]);
}

function _insertTestIssues(project) {
	var promise = _insert1000TestIssues(project);
	for (var i = 0; i < 100; i++)
		(function(index) {
			promise = promise.then(function () {
				return _insert1000TestIssues(project, index).then(function() {
					console.log("Done " + index);
				});
			});
		})(i);
	return promise;
}

function _insert1000TestIssues(project, index) {
	var creates = [];
	for (var i = 0; i < 1000; i++) {
		creates.push({ create: { _index: project.id, _type: "issues", _id: (1000*index) + (i + 1) }});
		creates.push(_buildIssue(i))
	}
	return client.bulk({
		body: creates,
		refresh: true
	});
}

function _buildIssue(index) {
	var priorityId = _random(4);
	return {
		id: index + 1,
		number: index + 1,
		name: "test issue name",
		description: "test issue description",
		isDeleted: false,
		opened: new Date(),
		closed: _random(3) % 2 == 0 ? new Date() : null,
		priorityId: priorityId,
		priorityOrder: priorityId,
		statusId: _random(6),
		milestoneId: _random(3),
		issueTypeId: _random(3),
		developerId: 1,
		testerId: 1,
		projectId: 1
	};
}

function _random(max) {
	return Math.floor((Math.random() * 100))%max+1;
}