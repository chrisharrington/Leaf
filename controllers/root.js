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
		return _getAllUserData(request).spread(function (priorities, statuses, users, transitions, projects, milestones, issueTypes, user) {
			return _mapAllUserData(priorities, statuses, users, transitions, projects, milestones, issueTypes, user);
		}).spread(function (html, priorities, statuses, users, transitions, projects, milestones, issueTypes, user, project, renderedScripts, renderedCss) {
			return _sendUserData(response, html, priorities, statuses, users, transitions, projects, milestones, issueTypes, user, project, renderedScripts, renderedCss);
		}).catch(function (e, a, b, c) {
			response.send("Error loading root: " + e, 500);
		});
	});

	function _getAllUserData(request) {
		return Promise.all([
			repositories.Priority.get(null, { sort: { order: -1 }}),
			repositories.Status.get(null, { sort: { order: 1 }}),
			repositories.User.get(),
			repositories.Transition.get(),
			repositories.Project.get(),
			repositories.Milestone.get(),
			repositories.IssueType.get(),
			repositories.User.one({ session: request.cookies.session }, "project")
		]);
	}

	function _mapAllUserData(priorities, statuses, users, transitions, projects, milestones, issueTypes, user) {
		return Promise.all([
			fs.readFileAsync("public/views/root.html"),
			mapper.mapAll("priority", "priority-view-model", priorities),
			mapper.mapAll("status", "status-view-model", statuses),
			mapper.mapAll("user", "user-view-model", users),
			mapper.mapAll("transition", "transition-view-model", transitions),
			mapper.mapAll("project", "project-view-model", projects),
			mapper.mapAll("milestone", "milestone-view-model", milestones),
			mapper.mapAll("issue-type", "issue-type-view-model", issueTypes),
			!user || (user.expiration != null && user.expiration < Date.now()) ? null : mapper.map("user", "user-view-model", user),
			!user ? null : mapper.map("project", "project-view-model", user.project),
			require("../bundling/scriptBundler").render(require("../bundling/assets").scripts(), app),
			require("../bundling/styleBundler").render(require("../bundling/assets").styles(), app)
		]);
	}

	function _sendUserData(response, html, priorities, statuses, users, transitions, projects, milestones, issueTypes, user, project, renderedScripts, renderedCss) {
		return response.send(mustache.render(html.toString(), {
			priorities: JSON.stringify(priorities),
			statuses: JSON.stringify(statuses),
			users: JSON.stringify(users),
			transitions: JSON.stringify(transitions),
			projects: JSON.stringify(projects),
			milestones: JSON.stringify(milestones),
			issueTypes: JSON.stringify(issueTypes),
			signedInUser: JSON.stringify(user),
			selectedProject: JSON.stringify(project),
			renderedScripts: renderedScripts,
			renderedCss: renderedCss
		}), 200);
	}
};