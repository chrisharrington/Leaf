var Promise = require("bluebird");
var repositories = require("../data/repositories");
var mapper = require("../data/mapping/mapper");
var authenticate = require("../authentication/authenticate");
var mongoose = require("mongoose");

var base = Object.spawn(require("./baseController"));

module.exports = function(app) {
	app.post("/milestone/delete", authenticate, function(request, response) {
		return Promise.all([
			repositories.Issue.get({ project: request.project._id, milestoneId: request.body.id }),
			repositories.Milestone.one({ _id: request.body.switchTo })
		]).spread(function(issues, milestone) {
			return Promise.all(issues.map(function(i) {
				i.milestoneId = milestone._id;
				i.milestone = milestone.name;
				return repositories.Issue.update(i, request.user);
			}));
		}).then(function() {
			repositories.Milestone.remove(request.body.id);
		}).then(function() {
			response.send(200);
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	});

	app.post("/milestone/save", authenticate, function(request, response) {
		return mapper.map("milestone-view-model", "milestone", request.body).then(function(milestone) {
			milestone.project = request.project._id;
			if (milestone._id) {
				return repositories.Issue.get({ milestoneId: milestone._id }).then(function(issues) {
					return repositories.Milestone.save(milestone).then(function() {
						return Promise.all(issues.map(function (i) {
							i.milestoneId = request.body.id;
							i.milestone = milestone.name;
							return repositories.Issue.update(i, request.user);
						}));
					});
				});
			}

			milestone._id = request.body.id = mongoose.Types.ObjectId();
			return repositories.Milestone.create(milestone);
		}).then(function(created) {
			response.send(request.body, 200);
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	});
};