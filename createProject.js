var _mongoose = require("mongoose");
var _config = require("./config");
var _models = require("./data/models");
var _all = require("node-promise").all;

var Promise = require("node-promise").Promise;

(function() {
	// _openDatabaseConnection(_config.databaseConnectionString, function(connection) {
	// 	_createProject(function(project) {
	// 		_all(_createMilestones(project)).then(function() {
	// 			connection.close();
	// 			console.log("Connection to database closed.");	
	// 		});
	// 	});
	// });
	
	
})();

require("./data/models/milestone").find(function(error, milestones) {
	console.log(milestones);
});

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