var Promise = require("bluebird");

var mongoose = require("mongoose");
var fs = Promise.promisifyAll(require("fs"));
var mustache = require("mustache");

module.exports = function(app) {
	app.get("/", function(request, response) {
		var models = require("../data/models");
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
				priorities: JSON.stringify(priorities),
				statuses: JSON.stringify(statuses),
				users: JSON.stringify(users),
				transitions: JSON.stringify(transitions),
				projects: JSON.stringify(projects),
				milestones: JSON.stringify(milestones),
				issueTypes: JSON.stringify(issueTypes)
			}));
		}).catch(function(e) {
			response.send("Error: " + e, 500);
		});
	});
};
