var Promise = require("bluebird");

var mongoose = require("mongoose");
var fs = Promise.promisifyAll(require("fs"));
var mustache = require("mustache");
var models = require("../data/models");
var mapper = require("../data/mapper");
var repositories = require("../data/repositories");
var bundler = require("../bundling/bundler");

module.exports = function(app) {
	app.get("/", function (request, response) {
		return Promise.all([
			repositories.Priority.all(),
			repositories.Status.all(),
			repositories.User.all(),
			repositories.Transition.all(),
			repositories.Project.all(),
			repositories.Milestone.all(),
			repositories.IssueType.all(),
			repositories.User.getOne({ session: request.cookies.session }, "project")
		]).spread(function (priorities, statuses, users, transitions, projects, milestones, issueTypes, user) {
			return Promise.all([
				fs.readFileAsync("public/views/root.html"),
				mapper.mapAll("priority", "priority-view-model", priorities),
				mapper.mapAll("status", "status-view-model", statuses),
				mapper.mapAll("user", "user-view-model", users),
				mapper.mapAll("transition", "transition-view-model", transitions),
				mapper.mapAll("project", "project-view-model", projects),
				mapper.mapAll("milestone", "milestone-view-model", milestones),
				mapper.mapAll("issue-type", "issue-type-view-model", issueTypes),
				mapper.map("user", "user-view-model", !user || (user.expiration != null && user.expiration < Date.now()) ? null : user),
				mapper.map("project", "project-view-model", user ? user.project : null),
				require("../bundling/scriptBundler").render(require("../bundling/assets").scripts(), app),
				require("../bundling/styleBundler").render(require("../bundling/assets").styles(), app)
			]);
		}).spread(function (html, priorities, statuses, users, transitions, projects, milestones, issueTypes, user, project, renderedScripts, renderedCss) {
			response.send(mustache.render(html.toString(), {
				priorities: JSON.stringify(priorities),
				statuses: JSON.stringify(statuses),
				users: JSON.stringify(users),
				transitions: JSON.stringify(transitions),
				projects: JSON.stringify(projects),
				milestones: JSON.stringify(milestones),
				issueTypes: JSON.stringify(issueTypes),
				signedInUser: JSON.stringify(user),
				selectedProject: JSON.stringify(user ? user.Project : null),
				renderedScripts: renderedScripts,
				renderedCss: renderedCss
			}), 200);
		}).catch(function (e) {
			response.send("Error loading root: " + e, 500);
		});
	});
};