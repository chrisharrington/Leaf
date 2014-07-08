var fs = require("fs");
var crypto = require("crypto");
var config = require("../config");
var csprng = require("csprng");
var mapper = require("../data/mapping/mapper");
var repositories = require("../data/repositories");

var Promise = require("bluebird");

module.exports = function(app) {
	app.get("/welcome", function(request, response) {
		return fs.readFileAsync("public/views/welcome.html").then(function(content) {
			response.send(content, 200);
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	});

	app.post("/sign-in", function(request, response) {
		var email = request.body.email, password = request.body.password, staySignedIn = request.body.staySignedIn == "true";
		return request.getProject().then(function(project) {
			if (!project)
				response.send(404);
			else
				return repositories.User.one({ emailAddress: email, projectId: project.id }, project).then(function(user) { return _setPermissions(user, project); }).then(function(user) {
					if (!user)
						return response.send(401);
					if (crypto.createHash(config("hashAlgorithm")).update(user.salt + password).digest("hex") === user.password)
						return _retrieveUserDetails(user, project, staySignedIn, response);
					return response.send(401);
				});
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});

		function _retrieveUserDetails(user, project, staySignedIn, response) {
			if (!user.session)
				user.session = csprng(512, 36);
			user.expiration = staySignedIn ? Date.now() + 1000 * 60 * 60 * 24 * 7 * 2 : null;
			response.cookie("session", user.session, staySignedIn ? { maxAge: 1000 * 60 * 60 * 24 * 7 * 2 } : { expires: false });
			return _deriveUserView(user, project, response);
		}

		function _deriveUserView(user, project, response) {
			return Promise.all([
				mapper.map("user", "user-view-model", user),
				mapper.map("project", "project-view-model", project)
			]).spread(function (mappedUser, mappedProject) {
				delete user.permissions;
				return repositories.User.update(user, project).then(function () {
					response.send({ user: mappedUser, project: mappedProject }, 200);
				});
			});
		}

		function _setPermissions(user, project) {
			if (!user)
				return;

			return repositories.UserPermission.get({ userId: user.id }, null, project).then(function(permissions) {
				user.permissions = permissions;
				return user;
			});
		}
	});
};