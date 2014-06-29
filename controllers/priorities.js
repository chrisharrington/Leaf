var Promise = require("bluebird");
var repositories = require("../data/repositories");
var mapper = require("../data/mapping/mapper");
var authenticate = require("../authentication/authenticate");
var mongoose = require("mongoose");

var base = Object.spawn(require("./baseController"));

module.exports = function(app) {
	app.post("/priorities/delete", authenticate, function(request, response) {
		return Promise.all([
			repositories.Issue.get({ projectId: request.project.id, priorityId: request.body.id }),
			repositories.Priority.one({ id: request.body.switchTo })
		]).spread(function(issues, priority) {
			return Promise.all(issues.map(function(i) {
				i.priorityId = priority.id;
				i.priority = priority.name;
				return repositories.Issue.updateIssue(i, request.user);
			}));
		}).then(function() {
			repositories.Priority.remove(request.body.id);
		}).then(function() {
			response.send(200);
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	});

	app.post("/priorities/save", authenticate, function(request, response) {
		return mapper.map("priority-view-model", "priority", request.body).then(function(priority) {
			priority.projectId = request.project.id;
			if (priority.id)
				return repositories.Priority.updateIssues(priority).then(function() {
					return repositories.Priority.save(priority);
				});
			return repositories.Priority.create(priority);
		}).then(function(created) {
			request.body.id = created;
			response.send(request.body, 200);
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	});

	app.post("/priorities/order", authenticate, function(request, response) {
		return mapper.mapAll("priority-view-model", "priority", request.body.priorities).then(function(priorities) {
			return Promise.map(priorities, function(priority) {
				return repositories.Priority.updateIssues(priority).then(function() {
					return repositories.Priority.save(priority);
				});
			}).then(function() {
				response.send(200);
			});
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	});
};