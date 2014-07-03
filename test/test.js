var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("./setup");

var repositories = require("./../data/repositories");
var connection = require("./../data/connection");
var config = require("./../config");

var _milestones = {}, _priorities = {}, _statuses = {}, _issueTypes = {}, _users = {};
var _oldMilestones, _oldPrioritites, _oldStatuses, _oldIssueTypes, _oldUsers;
var project;
var count = 90000;

connection.open().then(function() {
	require("../data/connection").open().then(function() {
		var promises = [];
		for (var i = 0; i < count; i++)
			promises.push(function(int) {
				return repositories.Issue.create({
					created_at: new Date(),
					updated_at: new Date(),
					isDeleted: false,
					name: "load testing name",
					description: "load testing description",
					closed: null,
					priorityId: 4,
					milestoneId: 1,
					statusId: 1,
					developerId: 1,
					testerId: 1,
					issueTypeId: 1,
					projectId: 1
				}).then(function() {
					if (int%500 == 0)
						console.log("Done " + int);
				});
			}(i));
		return Promise.all(promises);
	}).then(_getIssues).then(_insertIssues).then(function() {
		console.log("Done!");
	}).catch(function(e) {
		console.log(e.stack);
	}).finally(function() {
		process.exit(0);
	});
});

function _getIssues() {
	return require("../old-data/repositories").Issue.get({ name: { $not: { $eq: 'load testing issue name'}}}).then(function(issues) {
		return issues.map(function(i) {
			return {
				isDeleted: i.isDeleted,
				number: i.number,
				name: i.name,
				description: i.details,
				milestoneId: i.milestoneId ? _milestones[_oldMilestones[i.milestoneId.toString()].name].id : 1,
				priorityId: i.priorityId ? _priorities[_oldPriorities[i.priorityId.toString()].name].id : 1,
				statusId: i.statusId ? _statuses[_oldStatuses[i.statusId.toString()].name].id : 1,
				developerId: i.developerId ? _users[_oldUsers[i.developerId.toString()].name].id : 1,
				testerId: i.testerId ? _users[_oldUsers[i.testerId.toString()].name].id : 1,
				issueTypeId: i.typeId ? _issueTypes[_oldIssueTypes[i.typeId.toString()].name].id : 1,
				projectId: project.id,
				closed: i.closed,
				created_at: i.opened,
				updated_at: i.opened
			}
		});
	});
}

function _insertIssues(issues) {
	var promises = [];
	issues.forEach(function(issue) {
		promises.push(repositories.Issue.create(issue));
	});
	return Promise.all(promises);
}

function _getProject() {
	return repositories.Project.get().then(function(projects) {
		project = projects[0];
	});
}

function _initializeOldData() {
	var oldRepositories = require("../old-data/repositories");
	return Promise.all([
		oldRepositories.Milestone.get(),
		oldRepositories.Priority.get(),
		oldRepositories.Status.get(),
		oldRepositories.IssueType.get(),
		oldRepositories.User.get()
	]).spread(function(milestones, priorities, statuses, issueTypes, users) {
		_oldMilestones = _toIdDictionary(milestones);
		_oldPriorities = _toIdDictionary(priorities);
		_oldStatuses = _toIdDictionary(statuses);
		_oldIssueTypes = _toIdDictionary(issueTypes);
		_oldUsers = _toIdDictionary(users);
		console.log("Old data retrieved.");
	});
}

function _initializeData() {
	return Promise.all([
		repositories.Milestone.get(),
		repositories.Priority.get(),
		repositories.Status.get(),
		repositories.IssueType.get(),
		repositories.User.get()
	]).spread(function(milestones, priorities, statuses, issueTypes, users) {
		_milestones = _toNameDictionary(milestones);
		_priorities = _toNameDictionary(priorities);
		_statuses = _toNameDictionary(statuses);
		_issueTypes = _toNameDictionary(issueTypes);
		_users = _toNameDictionary(users);
		console.log("New data retrieved.");
	});
}

function _getNextIssues(skip) {
	return require("../old-data/repositories").Issue.get(null, { limit: limit, skip: skip || 0, populate: "milestone priority status type developer tester" }).then(function(issues) {
		return issues.map(function(i) {
			return {
				isDeleted: i.isDeleted,
				number: i.number,
				name: i.name,
				description: i.details,
				milestoneId: _milestones[_oldMilestones[i.milestoneId].name].id,
				priorityId: _priorities[_oldPriorities[i.priorityId].name].id,
				statusId: _statuses[_oldStatuses[i.statusId].name].id,
				developerId: _users[_oldUsers[i.developerId].name].id,
				testerId: _users[_oldUsers[i.testerId].name].id,
				issueTypeId: _issueTypes[_oldIssueTypes[i.typeId].name].id,
				projectId: project.id
			}
		});
	})
}

function _toIdDictionary(collection) {
	var dictionary = {};
	collection.forEach(function(item) {
		dictionary[item.id.toString()] = item;
	});
	return dictionary;
}

function _toNameDictionary(collection) {
	var dictionary = {};
	collection.forEach(function(item) {
		dictionary[item.name] = item;
	});
	return dictionary;
}