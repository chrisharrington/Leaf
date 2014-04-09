var mongoose = require("mongoose");
var config = require("./config");
var models = require("./data/models");
var crypto = require("crypto");
var csprng = require("csprng");

var Promise = require("bluebird");

var _connection;
var _project;
_openDatabaseConnection(config("databaseConnectionString")).then(function(connection) {
	_connection = connection;
	return _createProject();
}).then(function(project) {
	_project = project;
	return _createUser(project);
}).then(function(user) {
	return [
		_createIssueTypes(_project),
		_createStatuses(_project),
		_createPriorities(_project),
		_createMilestones(_project)
	];
});

function _createProject(callback) {
	return models.Project.removeAsync().then(function() {
		return models.Project.createAsync({ name: "Unnamed Issue Tracker" });
	}).then(function(project) {
		console.log("Project created.");
		return project;
	}).catch(function(e) {
		console.log("Error creating project: " + e);
	});
}

function _createUser(project) {
	return models.User.removeAsync().then(function() {
		var hash = crypto.createHash("sha512");
		var password = "test";
		var salt = csprng(512, 36);
		var hashed = hash.update(salt + password).digest("hex");
		return models.User.createAsync({ name: "Chris Harrington", emailAddress: "chrisharrington99@gmail.com", password: hashed, salt: salt, project: project._id }).catch(function(e) {
			console.log("Error creating user: " + e);
		}).then(function() {
			console.log("User created.");
		});
	});
}

function _createIssueTypes(project) {
	return models.IssueType.removeAsync().then(function() {
		return [
			models.IssueType.createAsync({ name: "Defect", project: project._id }),
			models.IssueType.createAsync({ name: "Feature", project: project._id }),
			models.IssueType.createAsync({ name: "Investigation", project: project._id })
		]
	}).then(function() {
		console.log("Created three issue types.");
	}).catch(function(e) {
		console.log("Error creating issue types: " + e);
	});
}

function _createStatuses(project) {
	return Promise.all([
		models.Status.removeAsync(),
		models.Transition.removeAsync()
	]).then(function() {
		return [
			models.Status.createAsync({ name: "Pending Development", order: 1, project: project._id }),
			models.Status.createAsync({ name: "In Development", order: 2, project: project._id }),
			models.Status.createAsync({ name: "Pending Testing", order: 3, project: project._id }),
			models.Status.createAsync({ name: "In Testing", order: 4, project: project._id }),
			models.Status.createAsync({ name: "Failed Testing", order: 5, project: project._id }),
			models.Status.createAsync({ name: "Complete", order: 6, project: project._id })
		];
	}).spread(function(pendingDevelopment, inDevelopment, pendingTesting, inTesting, failedTesting, complete) {
		console.log("Created six statuses.");
		return [
			models.Transition.createAsync({ name: "Start Development", from: pendingDevelopment._id, to: inDevelopment._id, project: project._id }),
			models.Transition.createAsync({ name: "Complete Development", from: inDevelopment._id, to: pendingTesting._id, project: project._id }),
			models.Transition.createAsync({ name: "Start Testing", from: pendingTesting._id, to: inTesting._id, project: project._id }),
			models.Transition.createAsync({ name: "Fail Testing", from: inTesting._id, to: failedTesting._id, project: project._id }),
			models.Transition.createAsync({ name: "Pass Testing", from: inTesting._id, to: complete, project: project._id }),
			models.Transition.createAsync({ name: "Restart Development", from: failedTesting._id, to: inDevelopment._id, project: project._id })
		];
	}).then(function() {
		console.log("Created six transitions.");
	});
}

function _createPriorities(project) {
	return models.Priority.removeAsync().then(function() {
		return [
			models.Priority.createAsync({ name: "Low", order: 1, project: project._id }),
			models.Priority.createAsync({ name: "Medium", order: 2, project: project._id }),
			models.Priority.createAsync({ name: "High", order: 3, project: project._id }),
			models.Priority.createAsync({ name: "Critical", order: 4, project: project._id })
		]
	}).then(function() {
		console.log("Created four priorities.");
	}).catch(function(e) {
		console.log("Error creating priorities: " + e);
	});
}

function _createMilestones(project) {
	models.Milestone.removeAsync().then(function() {
		return [
			models.Milestone.createAsync({ name: "Backlog", project: project._id }),
			models.Milestone.createAsync({ name: "Version 1", project: project._id }),
			models.Milestone.createAsync({ name: "Version 2", project: project._id })
		]
	}).then(function() {
		console.log("Created three milestones.");
	}).catch(function(e) {
		console.log("Error creating milestones: " + e);
	});
}

function _openDatabaseConnection(connectionString, callback) {
	return new Promise(function(resolve, reject) {
		mongoose.connect(config("databaseConnectionString"));
		var connection = mongoose.connection;
		connection.on("error", function(error) { console.log("Error opening connection: " + error); reject(error); });
		connection.once("open", function() { console.log("Database connection established."); resolve(connection); });
	});
}