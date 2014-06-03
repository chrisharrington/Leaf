var Promise = require("bluebird");
var repositories = require("../data/repositories");
var mapper = require("../data/mapping/mapper");
var authenticate = require("../authentication/authenticate");
var mongoose = require("mongoose");

var base = Object.spawn(require("./baseController"));

module.exports = function(app) {
	app.post("/priorities/delete", authenticate, function(request, response) {
		return Promise.all([
			repositories.Issue.get({ project: request.project._id, priorityId: request.body.id }),
			repositories.Priority.one({ _id: request.body.switchTo })
		]).spread(function(issues, priority) {
			return Promise.all(issues.map(function(i) {
				i.priorityId = priority._id;
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
			priority.project = request.project._id;
			if (priority._id) {
				return repositories.Issue.get({ priorityId: priority._id }).then(function(issues) {
					return repositories.Priority.save(priority).then(function() {
						return Promise.all(issues.map(function (i) {
							i.priorityId = request.body.id;
							i.priority = priority.name;
							return repositories.Issue.updateIssue(i, request.user);
						}));
					});
				});
			}

			priority._id = request.body.id = mongoose.Types.ObjectId();
			return repositories.Priority.create(priority);
		}).then(function(created) {
			response.send(request.body, 200);
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	});
};