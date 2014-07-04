require("../extensions/string");
require("../extensions/number");
require("../extensions/array");
require("../inheritance");

var Promise = require("bluebird");
var repositories = require("./repositories");

repositories.Project.remove("leaf").then(function() {
	var project = { name: "Leaf", formattedName: "leaf", id: 1 };
	return repositories.Project.create(project).then(function () {
		return Promise.all([
			_insertDefaultUsers(project),
			_insertDefaultPermissions(project),
			_insertDefaultMilestones(project),
			_insertDefaultPriorities(project),
			_insertDefaultStatuses(project),
			_insertDefaultIssueTypes(project)
		]);
	}).spread(function(users, permissions) {
		return _createUserPermissions(project, users, permissions);
	});
}).then(function() {
	console.log("Done!");
	process.exit(0);
}).catch(function(e) {
	console.log(e.stack);
});

function _createUserPermissions(project, users, permissions) {
	var inserts = [], count = 1;
	users.forEach(function(user) {
		permissions.forEach(function(permission) {
			inserts.push(repositories.UserPermission.create(project, { id: count++, userId: user.id, permissionId: permission.id }))
		});
	});
	return Promise.all(inserts);
}

function _insertDefaultMilestones(project) {
	var repo = repositories.Milestone;
	return repo.removeAll(project).then(function() {
		return Promise.all([
			repo.create(project, { id: 1, name: "Backlog", order: 1, projectId: project.id }),
			repo.create(project, { id: 2, name: "Version 1", order: 2, projectId: project.id }),
			repo.create(project, { id: 3, name: "Version 2", order: 3, projectId: project.id })
		]);
	});
}

function _insertDefaultPriorities(project) {
	var repo = repositories.Priority;
	return repo.removeAll(project).then(function() {
		return Promise.all([
			repo.create(project, { id: 1, name: "Critical", order: 1, colour: "#CF3A3C", projectId: project.id }),
			repo.create(project, { id: 2, name: "High", order: 2, colour: "#F27B1A", projectId: project.id }),
			repo.create(project, { id: 3, name: "Medium", order: 3, colour: "#EEB838", projectId: project.id }),
			repo.create(project, { id: 4, name: "Low", order: 4, colour: "#5295A5", projectId: project.id })
		]);
	});
}

function _insertDefaultStatuses(project) {
	var repo = repositories.Status;
	return repo.removeAll(project).then(function() {
		return Promise.all([
			repo.create(project, { id: 1, name: "Pending Development", order: 1, isDeveloperStatus: true, projectId: project.id }),
			repo.create(project, { id: 2, name: "In Development", order: 2, isDeveloperStatus: true, projectId: project.id }),
			repo.create(project, { id: 3, name: "Pending Testing", order: 3, isTesterStatus: true, projectId: project.id }),
			repo.create(project, { id: 4, name: "In Testing", order: 4, isTesterStatus: true, projectId: project.id }),
			repo.create(project, { id: 5, name: "Failed Testing", order: 5, isDeveloperStatus: true, projectId: project.id }),
			repo.create(project, { id: 6, name: "Complete", order: 6, isClosedStatus: true, projectId: project.id })
		]);
	});
}

function _insertDefaultIssueTypes(project) {
	var repo = repositories.IssueType;
	return repo.removeAll(project).then(function() {
		return Promise.all([
			repo.create(project, { id: 1, name: "Defect", projectId: project.id }),
			repo.create(project, { id: 2, name: "Feature", projectId: project.id }),
			repo.create(project, { id: 3, name: "Investigation", projectId: project.id })
		]);
	});
}

function _insertDefaultUsers(project) {
	var repo = repositories.User;
	return repo.removeAll(project).then(function() {
		return Promise.all([
			repo.create(project, {
				id: 1,
				name: "Chris Harrington",
				emailAddress: "chrisharrington99@gmail.com",
				password: "720f4e4f13581736a93944bce47075738afc5442e20ec743ce59210681f4bc799421dabcd480665b5b624646cdbd9ff5a626deb053fc1d53ba5fbde27bf9030b",
				salt: "qcmu8psnk58m6g104ad9d84xe",
				projectId: project.id
			})
		]);
	});
}

function _insertDefaultPermissions(project) {
	var repo = repositories.Permission;
	return repo.removeAll(project).then(function() {
		return Promise.all([
			repo.create(project, { id: 1, name: "Create an Issue", tag: "create-issue" }),
			repo.create(project, { id: 2, name: "Edit an Issue", tag: "edit-issue" }),
			repo.create(project, { id: 3, name: "Delete an Issue", tag: "delete-issue" }),
			repo.create(project, { id: 4, name: "Create a User", tag: "create-user" }),
			repo.create(project, { id: 5, name: "Edit a User", tag: "edit-user" }),
			repo.create(project, { id: 6, name: "Delete a User", tag: "delete-user" }),
			repo.create(project, { id: 7, name: "Modify User Permissions", tag: "modify-user-permissions" }),
			repo.create(project, { id: 8, name: "Reset a User's Password", tag: "reset-password" })
		]);
	});
}