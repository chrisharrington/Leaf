var Promise = require("bluebird");

var mongoose = require("mongoose");
var fs = Promise.promisifyAll(require("fs"));
var mustache = require("mustache");
var models = require("../data/models");
var mapper = require("../data/mapper");

module.exports = function(app) {
	app.get("/", function(request, response) {
		Promise.all([
			fs.readFileAsync("public/views/root.html"),
			models.Priority.findAsync(),
			models.Status.findAsync(),
			models.User.findAsync(),
			models.Transition.findAsync(),
			models.Project.findAsync(),
			models.Milestone.findAsync(),
			models.IssueType.findAsync()
		]).spread(function(html, priorities, statuses, users, transitions, projects, milestones, issueTypes) {
			response.send(mustache.render(html.toString(), {
				priorities: JSON.stringify(mapper.mapAll("priority", "priority-view-model", priorities)),
				statuses: JSON.stringify(mapper.mapAll("status", "status-view-model", statuses)),
				users: JSON.stringify(mapper.mapAll("user", "user-view-model", users)),
				transitions: JSON.stringify(mapper.mapAll("transition", "transition-view-model", transitions)),
				projects: JSON.stringify(mapper.mapAll("project", "project-view-model", projects)),
				milestones: JSON.stringify(mapper.mapAll("milestone", "milestone-view-model", milestones)),
				issueTypes: JSON.stringify(mapper.mapAll("issue-type", "issue-type-view-model", issueTypes))
			}));
		}).catch(function(e) {
			response.send("Error: " + e, 500);
		});
	});
};
