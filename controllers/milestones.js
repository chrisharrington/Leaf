var Promise = require("bluebird");
var repositories = require("../data/repositories");
var mapper = require("../data/mapping/mapper");
var authenticate = require("../authentication/authenticate");
var mongoose = require("mongoose");

var base = Object.spawn(require("./baseController"));

module.exports = function(app) {
	app.post("/milestones/delete", authenticate, function(request, response) {
		return request.getProject().then(function(project) {
			return Promise.all([
				repositories.Issue.get({ projectId: project.id, milestoneId: request.body.id }),
				repositories.Milestone.one({ id: request.body.switchTo })
			]).spread(function(issues, milestone) {
				return Promise.all(issues.map(function(i) {
					i.milestoneId = milestone.id;
					return repositories.Issue.updateIssue(i, request.user);
				}));
			}).then(function() {
				repositories.Milestone.remove(request.body.id);
			}).then(function() {
				response.send(200);
			});
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	});

	app.post("/milestones/save", authenticate, function(request, response) {
		return Promise.all([
			mapper.map("milestone-view-model", "milestone", request.body),
			request.getProject()
		]).spread(function(milestone, project) {
			milestone.projectId = project.id;
			if (milestone.id && milestone.id != "")
				return repositories.Milestone.update(milestone);

			delete milestone.id;
			return repositories.Milestone.create(milestone);
		}).then(function(created) {
			request.body.id = created;
			response.send(request.body, 200);
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	});

	app.post("/milestones/order", authenticate, function(request, response) {
		return mapper.mapAll("milestone-view-model", "milestone", request.body.milestones).then(function(milestones) {
			var promises = [];
			milestones.forEach(function(milestone) {
				promises.push(repositories.Milestone.update(milestone));
			});
			return Promise.all(promises);
		}).then(function() {
			response.send(200);
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	});
};