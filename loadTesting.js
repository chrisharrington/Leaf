require("./extensions/string");
require("./extensions/number");
require("./inheritance");

var config = require("./config");
var mapper = require("./data/mapping/mapper");
var bundler = require("./bundling/bundler");
var caches = require("./data/caches");
var controllers = require("./controllers/controllers");
var connection = require("./data/connection");
var repositories = require("./data/repositories");
var ObjectId = require("mongoose").Types.ObjectId;
var models = require("./data/models");

var Promise = require("bluebird");

var ISSUE_COUNT = 10000;

return connection.open().then(function () {
	//return _removeIssues();
	return Promise.all(_buildIssues(ISSUE_COUNT));
}).then(function () {
	console.log("Done.");
});

function _removeIssues() {
	return new Promise(function(resolve, reject) {
		models.Issue.find({ type: "Load Testing" }).remove(function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

function _buildIssues(count) {
	var promises = [];
	for (var i = 0; i < count; i++) {
		promises.push(repositories.Issue.create({
			name: "load testing issue name",
			number: Math.round(Math.random()*10)%3,
			closed: Date.now(),
			developer: "Chris Harrington",
			tester: "Chris Harrington",
			priority: "Medium",
			status: "Pending Development",
			milestone: "Backlog",
			type: "Load Testing",
			project: ObjectId("532bb0e4654c146016485bec"),
			updatedBy: "Chris Harrington",
			priorityId: ObjectId("532bb0e5654c146016485bf5"),
			priorityOrder: 2,
			statusId: ObjectId("532bb0e5654c146016485bf8"),
			statusOrder: 1,
			milestoneId: ObjectId("532bb0e5654c146016485bf1"),
			typeId: ObjectId("532bb0e5654c146016485bf0"),
			updatedById: ObjectId("532bb0e4654c146016485bed"),
			testerId: ObjectId("532bb0e4654c146016485bed"),
			developerId: ObjectId("532bb0e4654c146016485bed"),
			details: "load testing issue details",
			updated: Date.now(),
			opened: Date.now(),
			isDeleted: false
		}));
		console.log("Pushed at " + i);
	}
	return promises;
}

/*
 name: String,
 details: String,
 number: Number,
 isDeleted: { type: Boolean, default: false },
 opened: { type: Date, default: Date.now },
 closed: Date,
 updated: { type: Date, default: Date.now },
 priorityId: objectId,
 priority: String,
 priorityOrder: Number,
 developerId: objectId,
 developer: String,
 testerId: objectId,
 tester: String,
 statusId: objectId,
 status: String,
 statusOrder: Number,
 milestoneId: objectId,
 milestone: String,
 typeId: objectId,
 type: String,
 updatedById: objectId,
 updatedBy: String,
 project: { type: objectId, ref: "project" }
 */