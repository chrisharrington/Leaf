var _fs = require("fs");
var _models = require("../data/models");
var _all = require("node-promise").all;
var _mustache = require("mustache");

var Promise = require("node-promise").Promise;

exports.index = function(request, response) {
	_all([
		_getRootContents(),
		_getAllPriorities(),
		_getAllStatuses(),
		_getAllUsers(),
		_getAllProjects(),
		_getAllMilestones(),
		_getAllIssueTypes(),
		_getAllTransitions()
	]).then(function(results) {
		response.writeHead(200, { "Content-Type": "text/html" });
        response.write(results[0]);
        response.end();
	});
	
    // _fs.readFile("public/views/root.html", function(err, content) {
    
    // });
};

function _getRootContents() {
	var promise = new Promise();
	_fs.readFile("public/views/root.html", function(error, content) {
		promise.resolve(content);
	});
	return promise;
}

function _getAllPriorities() {
	var promise = new Promise();
	_models.Priority.find(function(e, priorities) {
		promise.resolve(priorities);
	});
	return promise;
}

function _getAllStatuses() {
	var promise = new Promise();
	_models.Status.find(function(e, statuses) {
		promise.resolve(statuses);
	});
	return promise;
}

function _getAllUsers() {
	var promise = new Promise();
	_models.User.find(function(e, users) {
		promise.resolve(users);
	});
	return promise;
}

function _getAllTransitions() {
	var promise = new Promise();
	_models.Transition.find(function(e, transitions) {
		promise.resolve(transitions);
	});
	return promise;
}

function _getAllMilestones() {
	var promise = new Promise();
_models.Milestone.find(function(e, milestones) {
		promise.resolve(milestones);
	});
	return promise;
}

function _getAllProjects() {
	var promise = new Promise();
	_models.Transition.find(function(e, projects) {
		promise.resolve(projects);
	});
	return promise;
}

function _getAllIssueTypes() {
	var promise = new Promise();
	_models.IssueType.find(function(e, issueTypes) {
		promise.resolve(issueTypes);
	});
	return promise;
}