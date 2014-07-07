var Promise = require("bluebird");

var mongoose = require("mongoose");
var fs = Promise.promisifyAll(require("fs"));
var mustache = require("mustache");
var mapper = require("../data/mapping/mapper");
var repositories = require("../data/repositories");
var caches = require("../data/caches");
var bundler = require("../bundling/bundler");
var config = require("../config");

module.exports = function(app) {
	app.get("/", function (request, response) {
		return _getAllUserData(request).spread(function (permissions, priorities, statuses, users, projects, milestones, issueTypes, user, currentProject) {
			return _mapAllUserData(request, permissions, priorities, statuses, users, [], projects, milestones, issueTypes, user, currentProject);
		}).spread(function (html, permissions, priorities, statuses, users, transitions, projects, milestones, issueTypes, user, project, renderedScripts) {
			return _sendUserData(response, html, permissions, priorities, statuses, users, transitions, projects, milestones, issueTypes, user, project, renderedScripts);
		}).catch(function (e) {
			response.send(e.stack.formatStack(), 500);
		});
	});

	function _getAllUserData(request) {
		return request.getProject().then(function(project) {
			return Promise.all([
				repositories.Permission.get(null, { sort: { name: 1 }}),
				repositories.Priority.get({ projectId: project.id, isDeleted: false }, { sort: { order: 1 }}, project),
				repositories.Status.get({ projectId: project.id, isDeleted: false }, { sort: { order: 1 }}, project),
				repositories.User.get({ projectId: project.id }, { sort: { name: 1 }}, project),
				repositories.Project.all(),
				repositories.Milestone.get({ projectId: project.id, isDeleted: false }, { sort: { order: 1 }}, project),
				repositories.IssueType.all(project),
				_getSignedInUser(request),
				project
			]);
		});
	}

	function _setPermissions(user) {
		if (!user)
			return;

		return repositories.UserPermission.get({ userId: user.id }).then(function(permissions) {
			user.permissions = permissions;
			return user;
		});
	}

	function _getSignedInUser(request) {
		var session = request.cookies.session;
		return session ? repositories.User.one({ session: session }).then(_setPermissions) : null;
	}

	function _mapAllUserData(request, permissions, priorities, statuses, users, transitions, projects, milestones, issueTypes, user, currentProject) {
		return Promise.all([
			fs.readFileAsync("public/views/root.html"),
			mapper.mapAll("permission", "permission-view-model", permissions),
			mapper.mapAll("priority", "priority-view-model", priorities),
			mapper.mapAll("status", "status-view-model", statuses),
			mapper.mapAll("user", "user-view-model", users),
			mapper.mapAll("transition", "transition-view-model", transitions),
			mapper.mapAll("project", "project-view-model", projects),
			mapper.mapAll("milestone", "milestone-view-model", milestones),
			mapper.mapAll("issue-type", "issue-type-view-model", issueTypes),
			!user || (user.expiration != null && user.expiration < Date.now()) ? null : mapper.map("user", "user-view-model", user),
			!user ? null : mapper.map("project", "project-view-model", currentProject),
			require("../bundling/scriptBundler").render(require("../bundling/assets").scripts(), app)
		]);
	}

	function _sendUserData(response, html, permissions, priorities, statuses, users, transitions, projects, milestones, issueTypes, user, project, renderedScripts) {
		var buildNumber = config.call(this, "buildNumber");
		response.send(mustache.render(html.toString(), {
			permissions: JSON.stringify(permissions),
			priorities: JSON.stringify(priorities),
			statuses: JSON.stringify(statuses),
			users: JSON.stringify(users),
			transitions: JSON.stringify(transitions),
			projects: JSON.stringify(projects),
			milestones: JSON.stringify(milestones),
			issueTypes: JSON.stringify(issueTypes),
			signedInUser: JSON.stringify(user),
			projectId: JSON.stringify(project ? project.id : null),
			projectName: JSON.stringify(project ? project.name : null),
			renderedScripts: renderedScripts,
			styleLocation: buildNumber ? ("/style?v=" + buildNumber) : "/style"
		}), 200);
	}
};