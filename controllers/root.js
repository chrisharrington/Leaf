var _fs = require("fs");
var _models = require("../data/models");
var _all = require("node-promise").all;
var _mustache = require("mustache");

var _html;
var _priorities;
var _statuses;
var _users;
var _transitions;
var _milestones;
var _projects;
var _issueTypes;

exports.index = function(request, response) {
	_all(
		_getRootContents(),
		_getAllPriorities(),
		_getAllStatuses(),
		_getAllUsers(),
		_getAllProjects(),
		_getAllMilestones(),
		_getAllIssueTypes(),
		_getAllTransitions()
	).then(function() {
		response.writeHead(200, { "Content-Type": "text/html" });
        response.write(_html);
        response.end();
	});
	
    // _fs.readFile("public/views/root.html", function(err, content) {
    
    // });
};

function _getRootContents() {
	return _fs.readFile("public/views/root.html", function(error, content) {
		_html = content;
	});
}

function _getAllPriorities() {
	return _models.Priority.find(function(priorities) {
		_priorities = priorities;
	});
}

function _getAllStatuses() {
	return _models.Status.find(function(statuses) {
		_statuses = statuses;
	});
}

function _getAllUsers() {
	return _models.User.find(function(users) {
		_users = users;
	});
}

function _getAllTransitions() {
	return _models.Transition.find(function(transitions) {
		_transitions = transitions;
	});
}

function _getAllMilestones() {
	return _models.Milestone.find(function(milestones) {
		_milestones = milestones;
	});
}

function _getAllProjects() {
	return _models.Transition.find(function(projects) {
		_projects = projects;
	});
}

function _getAllIssueTypes() {
	return _models.IssueTypes.find(function(issueTypes) {
		_issueTypes = issueTypes;
	});
}