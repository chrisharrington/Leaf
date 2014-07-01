var Promise = require("bluebird");
var repositories = require("../data/repositories");
var mapper = require("../data/mapping/mapper");
var authenticate = require("../authentication/authenticate");
var mongoose = require("mongoose");

var base = Object.spawn(require("./baseController"));

module.exports = function(app) {
	app.post("/statuses/delete", authenticate, function(request, response) {
		return request.getProject().then(function(project) {
			return Promise.all([
				repositories.Issue.get({ projectId: project.id, statusId: request.body.id }),
				repositories.Status.one({ id: request.body.switchTo })
			]).spread(function(issues, status) {
				return Promise.all(issues.map(function(i) {
					i.statusId = status.id;
					return repositories.Issue.updateIssue(i, request.user);
				}));
			}).then(function() {
				repositories.Status.remove(request.body.id);
			}).then(function() {
				response.send(200);
			});
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	});

	app.post("/statuses/save", authenticate, function(request, response) {
		return Promise.all([
			mapper.map("status-view-model", "status", request.body),
			request.getProject()
		]).spread(function(status, project) {
			status.projectId = project.id;
			if (status.id && status.id != "")
				return repositories.Status.update(status);

			delete status.id;
			return repositories.Status.create(status);
		}).then(function(created) {
			request.body.id = created;
			response.send(request.body, 200);
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	});

	app.post("/statuses/order", authenticate, function(request, response) {
		return mapper.mapAll("status-view-model", "status", request.body.statuses).then(function(statuses) {
			var promises = [];
			statuses.forEach(function(status) {
				promises.push(repositories.Status.update(status));
			});
			return Promise.all(promises);
		}).then(function() {
			response.send(200);
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	});
};