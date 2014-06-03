var Promise = require("bluebird");
var repositories = require("../data/repositories");
var mapper = require("../data/mapping/mapper");
var authenticate = require("../authentication/authenticate");
var mongoose = require("mongoose");

var base = Object.spawn(require("./baseController"));

module.exports = function(app) {
	app.post("/statuses/delete", authenticate, function(request, response) {
		return Promise.all([
			repositories.Issue.get({ project: request.project._id, statusId: request.body.id }),
			repositories.Status.one({ _id: request.body.switchTo })
		]).spread(function(issues, status) {
			return Promise.all(issues.map(function(i) {
				i.statusId = status._id;
				i.status = status.name;
				return repositories.Issue.updateIssue(i, request.user);
			}));
		}).then(function() {
			repositories.Status.remove(request.body.id);
		}).then(function() {
			response.send(200);
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	});

	app.post("/statuses/save", authenticate, function(request, response) {
		return mapper.map("status-view-model", "status", request.body).then(function(status) {
			status.project = request.project._id;
			if (status._id) {
				return repositories.Issue.get({ statusId: status._id }).then(function(issues) {
					return repositories.Status.save(status).then(function() {
						return Promise.all(issues.map(function (i) {
							i.statusId = request.body.id;
							i.status = status.name;
							return repositories.Issue.updateIssue(i, request.user);
						}));
					});
				});
			}

			status._id = request.body.id = mongoose.Types.ObjectId();
			return repositories.Status.create(status);
		}).then(function() {
			response.send(request.body, 200);
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	});
};