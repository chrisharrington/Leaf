var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("./setup");

var repositories = require("./../data/repositories");
var connection = require("./../data/connection");
var config = require("./../config");

var _milestones = {}, _priorities = {}, _statuses = {}, _issueTypes = {}, _users = {};
var skip = 0;
var toGet = 1000;

connection.open().then(function() {
	require("../old-data/connection").open().then(function() {
		return _getNextIssues(skip);
	}).then(function(result) {
		console.log("done");
	}).catch(function(e) {
		console.log(e.stack);
	}).finally(function() {
		process.exit(0);
	});
});

function _initializeData() {
	return Promise.all([
		repositories.Milestone.get(),
		repositories.Priority.get(),
		repositories.Status.get(),
		repositories.IssueType.get(),
		repositories.User.get()
	]).spread(function(milestones, priorities, statuses, issueTypes, users) {
		_milestones = _toIdDictionary(milestones);
		_priorities = _toIdDictionary(priorities);
		_statuses = _toIdDictionary(statuses);
		_issueTypes = _toIdDictionary(issueTypes);
		_users = _toIdDictionary(users);
	});
}

function _getNextIssues(skip) {
	return require("../old-data/repositories").Issue.get(null, { limit: 1000, skip: skip || 0, populate: "milestone priority status type developer tester" }).then(function(issues) {
		return issues.map(function(issue) {
			issue.milestoneId = issue.milestone.id;
			issue.priorityId = issue.priority.id;
			issue.statusId = issue.status.id;
			issue.issueTypeId = issue.type.id;
			issue.developerId = issue.developer.id;
			issue.testerId = issue.tester.id;
		});
	})
}

function _toIdDictionary(collection) {
	var dictionary = {};
	collection.forEach(function(item) {
		dictionary[item.id] = item;
	});
	return dictionary;
}