var _mongoose = require("mongoose");
var _config = require("./config");
var _models = require("./data/models");
var _all = require("node-promise").all;

var Promise = require("node-promise").Promise;

(function() {
	_openDatabaseConnection(_config.databaseConnectionString, function(connection) {
		_createProject(function(project) {
			_createUser(project, function(user) {
				_all(_createMilestones(project), _createPriorities(project), _createStatuses(project), _createIssueTypes(project)).then(function() {
					connection.close();
					console.log("Connection to database closed.");	
				});
			});
		});
	});
})();

function _createUser(project, callback) {
	_models.User.remove(function() {
		new _models.User({ name: "Chris Harrington", emailAddress: "chrisharrington99@gmail.com", project: project._id }).save(function(error, user) {
			if (error)
				console.log("Could not create user: " + error);
			else {
				console.log("Created one user.");
				callback(user);
			}
		})
	});
}

function _createIssueTypes(project) {
	var promise = new Promise();
	_models.IssueType.remove(function() {
		_all(
			new _models.IssueType({ name: "Defect", project: project._id }).save(),
			new _models.IssueType({ name: "Feature", project: project._id }).save(),
			new _models.IssueType({ name: "Investigation", project: project._id }).save()
		).then(function() {
			console.log("Created three issue types.");
			promise.resolve();
		});
	});
	return promise;
}

function _createStatuses(project) {
	var promise = new Promise();
	_models.Status.remove(function() {
		var pendingDevelopment, inDevelopment, pendingTesting, inTesting, failedTesting, complete;
		_all(
			new _models.Status({ name: "Pending Development", order: 1, project: project._id }).save(function(e, m) { pendingDevelopment = m; }),
			new _models.Status({ name: "In Development", order: 2, project: project._id }).save(function(e, m) { inDevelopment = m; }),
			new _models.Status({ name: "Pending Testing", order: 3, project: project._id }).save(function(e, m) { pendingTesting = m; }),
			new _models.Status({ name: "In Testing", order: 4, project: project._id }).save(function(e, m) { inTesting = m; }),
			new _models.Status({ name: "Failed Testing", order: 5, project: project._id }).save(function(e, m) { failedTesting = m; }),
			new _models.Status({ name: "Complete", order: 6, project: project._id }).save(function(e, m) { complete = m; })
		).then(function() {
			console.log("Created six statuses.");
			_models.Transition.remove(function() {
				_all(
					new _models.Transition({ name: "Start Development", from: pendingDevelopment._id, to: inDevelopment._id, project: project._id }),
					new _models.Transition({ name: "Complete Development", from: inDevelopment._id, to: pendingTesting._id, project: project._id }),
					new _models.Transition({ name: "Start Testing", from: pendingTesting._id, to: inTesting._id, project: project._id }),
					new _models.Transition({ name: "Fail Testing", from: inTesting._id, to: failedTesting._id, project: project._id }),
					new _models.Transition({ name: "Pass Testing", from: inTesting._id, to: complete, project: project._id }),
					new _models.Transition({ name: "Restart Development", from: failedTesting._id, to: inDevelopment._id, project: project._id })
				).then(function() {
					console.log("Created six transitions.");
					promise.resolve();
				})
			});
		});
	});
	return promise;
}

function _createPriorities(project) {
	var promise = new Promise();
	_models.Priority.remove(function() {
		_all(
			new _models.Priority({ name: "Low", order: 1, project: project._id }).save(),
			new _models.Priority({ name: "Medium", order: 2, project: project._id }).save(),
			new _models.Priority({ name: "High", order: 3, project: project._id }).save(),
			new _models.Priority({ name: "Critical", order: 4, project: project._id }).save()
		).then(function() {
			console.log("Created four priorities.");
			promise.resolve();
		});
	});
	return promise;
}

function _createMilestones(project) {
	var promise = new Promise();
	_models.Milestone.remove(function() {
		_all(
			new _models.Milestone({ name: "Backlog", project: project._id }).save(),
			new _models.Milestone({ name: "Version 1", project: project._id }).save(),
			new _models.Milestone({ name: "Version 2", project: project._id }).save()
		).then(function() {
			console.log("Created three milestones.");
			promise.resolve();
		});
	});
	return promise;
}

function _openDatabaseConnection(connectionString, callback) {
	_mongoose.connect("mongodb://nodejitsu_chrisharrington:5bujcm5jeineb9iqhdvddn19ho@ds061518.mongolab.com:61518/nodejitsu_chrisharrington_nodejitsudb9974367446");
    var connection = _mongoose.connection;
    connection.on("error", function(error) { console.log("An error occurred while opening the Mongo database: " + error); });
    connection.once("open", function() {
		console.log("Connection to database opened.");
		callback(connection);	
    });
}

function _createProject(callback) {
	_models.Project.remove().exec();
	console.log("Removed all existing projects.");
	
	var project = new _models.Project({
		name: "Unnamed Issue Tracker",
	});
	project.save(function(error, project) {
		if (error)
			console.log("Failed to create project: " + error);
		console.log("Project created.");
		callback(project);
	});
}