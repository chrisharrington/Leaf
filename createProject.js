var _mongoose = require("mongoose");
var _config = require("./config");
var _models = require("./data/models");

var Promise = require("bluebird");

var _connection;
var _project;
_openDatabaseConnection(_config.databaseConnectionString).then(function(connection) {
	_connection = connection;
	return _createProject();
}).then(function(project) {
	_project = project;
	return _createUser(project);
}).then(function(user) {
	Promise.all([
		_createIssueTypes(_project),
		_createStatuses(_project),
		_createPriorities(_project),
		_createMilestones(_project)
	]).finally(function() {
		_connection.close();
		console.log("Database connection closed.");
	});
});

function _createProject(callback) {
	return _models.Project.removeAsync().then(function() {
		return _models.Project.createAsync({ name: "Unnamed Issue Tracker" });
	}).then(function(project) {
		console.log("Project created.");
		return project;
	}).catch(function(e) {
		console.log("Error creating project: " + e);
	});
}

function _createUser(project) {
	return _models.User.removeAsync().then(function() {
		return _models.User.createAsync({ name: "Chris Harrington", emailAddress: "chrisharrington99@gmail.com", project: project._id }).catch(function(e) {
			console.log("Error creating user: " + e);
		}).then(function() {
			console.log("User created.");
		});
	});
}

function _createIssueTypes(project) {
	return _models.IssueType.removeAsync().then(function() {
		return [
			_models.IssueType.createAsync({ name: "Defect", project: project._id }),
			_models.IssueType.createAsync({ name: "Feature", project: project._id }),
			_models.IssueType.createAsync({ name: "Investigation", project: project._id })
		]
	}).then(function() {
		console.log("Created three issue types.");
	}).catch(function(e) {
		console.log("Error creating issue types: " + e);
	});
}

function _createStatuses(project) {
	return Promise.all([
		_models.Status.removeAsync(),
		_models.Transition.removeAsync()
	]).then(function() {
		return [
			_models.Status.createAsync({ name: "Pending Development", order: 1, project: project._id }),
			_models.Status.createAsync({ name: "In Development", order: 2, project: project._id }),
			_models.Status.createAsync({ name: "Pending Testing", order: 3, project: project._id }),
			_models.Status.createAsync({ name: "In Testing", order: 4, project: project._id }),
			_models.Status.createAsync({ name: "Failed Testing", order: 5, project: project._id }),
			_models.Status.createAsync({ name: "Complete", order: 6, project: project._id })
		];
	}).spread(function(pendingDevelopment, inDevelopment, pendingTesting, inTesting, failedTesting, complete) {
		console.log("Created six statuses.");
		return [
			_models.Transition.createAsync({ name: "Start Development", from: pendingDevelopment._id, to: inDevelopment._id, project: project._id }),
			_models.Transition.createAsync({ name: "Complete Development", from: inDevelopment._id, to: pendingTesting._id, project: project._id }),
			_models.Transition.createAsync({ name: "Start Testing", from: pendingTesting._id, to: inTesting._id, project: project._id }),
			_models.Transition.createAsync({ name: "Fail Testing", from: inTesting._id, to: failedTesting._id, project: project._id }),
			_models.Transition.createAsync({ name: "Pass Testing", from: inTesting._id, to: complete, project: project._id }),
			_models.Transition.createAsync({ name: "Restart Development", from: failedTesting._id, to: inDevelopment._id, project: project._id })
		];
	}).then(function() {
		console.log("Created six transitions.");
	});
}

function _createPriorities(project) {
	return _models.Priority.removeAsync().then(function() {
		return [
			_models.Priority.createAsync({ name: "Low", order: 1, project: project._id }),
			_models.Priority.createAsync({ name: "Medium", order: 2, project: project._id }),
			_models.Priority.createAsync({ name: "High", order: 3, project: project._id }),
			_models.Priority.createAsync({ name: "Critical", order: 4, project: project._id })
		]
	}).then(function() {
		console.log("Created four priorities.");
	}).catch(function(e) {
		console.log("Error creating priorities: " + e);
	});
}

function _createMilestones(project) {
	_models.Milestone.removeAsync().then(function() {
		return [
			_models.Milestone.createAsync({ name: "Backlog", project: project._id }),
			_models.Milestone.createAsync({ name: "Version 1", project: project._id }),
			_models.Milestone.createAsync({ name: "Version 2", project: project._id })
		]
	}).then(function() {
		console.log("Created three milestones.");
	}).catch(function(e) {
		console.log("Error creating milestones: " + e);
	});
}

function _openDatabaseConnection(connectionString, callback) {
	return new Promise(function(resolve, reject) {
		_mongoose.connect("mongodb://nodejitsu_chrisharrington:5bujcm5jeineb9iqhdvddn19ho@ds061518.mongolab.com:61518/nodejitsu_chrisharrington_nodejitsudb9974367446");
		var connection = _mongoose.connection;
		connection.on("error", function(error) { console.log("Error opening connectin: " + error); reject(error); });
		connection.once("open", function() { console.log("Database connection establisehd."); resolve(connection); });
	});
}