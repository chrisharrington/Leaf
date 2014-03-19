var mongoose = require("mongoose");
var fs = require("fs");

var Promise = require("bluebird");

exports.index = function(request, response) {
//	var readFile = Promise.promisify(fs.readFile);
//	readFile("public/views/root.html").then(function(html) {
//		console.log("Done: " + html);
//	});

	_openDatabaseConnection().then(function(connection) {
		var prioritySchema = mongoose.Schema({
			name: String,
			isDeleted: { type: Boolean, default: false },
			order: Number,

			project: { type: mongoose.Schema.Types.ObjectId, ref: "project" },
		});

		var Priority = mongoose.model('priority', prioritySchema);

		Priority = Promise.promisifyAll(Priority);
		Promise.promisifyAll(Priority.prototype);

		Priority.findAsync().then(function(priorities) {
			console.log(priorities);
		}).finally(function() {
			connection.close();
		});
	});
};

function _openDatabaseConnection(callback) {
	return new Promise(function(resolve, reject) {
		mongoose.connect("mongodb://nodejitsu_chrisharrington:5bujcm5jeineb9iqhdvddn19ho@ds061518.mongolab.com:61518/nodejitsu_chrisharrington_nodejitsudb9974367446");
		var connection = mongoose.connection;
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