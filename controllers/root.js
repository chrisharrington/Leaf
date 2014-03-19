var Promise = require("bluebird");

var _mongoose = require("mongoose");
var _fs = Promise.promisifyAll(require("fs"));
var _models = Promise.promisifyAll(require("../data/models"));
var _mustache = require("mustache");

exports.index = function(request, response) {
	_openDatabaseConnection().then(function(connection) {
		_models.Priority.find(function(error, priorities) {
			if (error)
				console.log("Error: " + error);
			else
				console.log("Priorities: " + priorities);
			connection.close();
		});
	}).catch(function(error) {
		console.log("Catch: " + error);
	});

//	new Promise(function(resolve, reject) {
//		_models.Priority.find(function(error, priorities) {
//			if (error)
//				reject(error);
//			else
//				resolve(priorities);
//		});
//	}).then(function(priorities) {
//		console.log("Priorities: " + priorities);
//	}).catch(function(error) {
//		console.log("Error: " + error);
//	});

//	Promise.all([
//		//_getRootHtml(),
//		_getAllPriorities()
////		_getAllStatuses(),
////		_getAllUsers(),
////		_getAllProjects(),
////		_getAllMilestones(),
////		_getAllIssueTypes(),
////		_getAllTransitions()
//	]).then(function(results) {
//		console.log("Html: " + results[0]);
//		console.log("Priorities: " + results[1]);
//		response.writeHead(200, { "Content-Type": "text/html" });
//        response.write(results[0]);
//        response.end();
//	});
};

function _openDatabaseConnection(callback) {
	return new Promise(function(resolve, reject) {
		_mongoose.connect("mongodb://nodejitsu_chrisharrington:5bujcm5jeineb9iqhdvddn19ho@ds061518.mongolab.com:61518/nodejitsu_chrisharrington_nodejitsudb9974367446");
		var connection = _mongoose.connection;
		connection.on("error", function(error) { reject(error); });
		connection.once("open", function() { resolve(connection); });
	});
}

function _getRootHtml() {
	console.log("Getting root contents...");
	return _fs.readFile("public/views/root.html");
}

function _getAllPriorities() {
	console.log("Getting all priorities...");
	return _models.Priority.find().exec();

//	var promise = new Promise();
//	_models.Priority.find(function(e, priorities) {
//		if (e)
//			console.log("Error retrieving priorities: " + error);
//		else
//			console.log("Retrieved " + priorities.length + " priorities.");
//		promise.resolve(priorities || []);
//	});
//	return promise;
}

function _getAllStatuses() {
	console.log("Getting all statuses...");
	var promise = new Promise();
	_models.Status.find(function(e, statuses) {
		if (e)
			console.log("Error retrieving statuses: " + e);
		else
			console.log("Retrieved " + statuses.length + " statuses.");
		promise.resolve(statuses || []);
	});
	return promise;
}

function _getAllUsers() {
	console.log("Getting all users...");
	var promise = new Promise();
	_models.User.find(function(e, users) {
		if (e)
			console.log("Error retrieving users: " + e);
		else
			console.log("Retrieved " + users.length + " users.");
		promise.resolve(users || []);
	});
	return promise;
}

function _getAllTransitions() {
	console.log("Getting all transitions...");
	var promise = new Promise();
	_models.Transition.find(function(e, transitions) {
		if (e)
			console.log("Error retrieving transitions: " + e);
		else
			console.log("Retrieved " + transitions.length + " transitions.");
		promise.resolve(transitions || []);
	});
	return promise;
}

function _getAllMilestones() {
	console.log("Getting all milestones...");
	var promise = new Promise();
	_models.Milestone.find(function(e, milestones) {
		if (e)
			console.log("Error retrieving milestones: " + e);
		else
			console.log("Retrieved " + milestones.length + " milestones.");
		promise.resolve(milestones || []);
	});
	return promise;
}

function _getAllProjects() {
	console.log("Getting all projects...");
	var promise = new Promise();
	_models.Transition.find(function(e, projects) {
		if (e)
			console.log("Error retrieving projects: " + e);
		else
			console.log("Retrieved " + projects.length + " projects.");
		promise.resolve(projects || []);
	});
	return promise;
}

function _getAllIssueTypes() {
	console.log("Getting all issue types...");
	var promise = new Promise();
	_models.IssueType.find(function(e, issueTypes) {
		if (e)
			console.log("Error retrieving issueTypes: " + e);
		else
			console.log("Retrieved " + issueTypes.length + " issueTypes.");
		promise.resolve(issueTypes || []);
	});
	return promise;
}