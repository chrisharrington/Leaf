var fs = require("fs");
var models = require("../data/models");
var crypto = require("crypto");
var config = require("../config");
var csprng = require("csprng");
var mapper = require("../data/mapper");
var repositories = require("../data/repositories");

var Promise = require("bluebird");

module.exports = function(app) {
	app.get("/welcome", function(request, response) {
		return fs.readFileAsync("public/views/welcome.html").then(function(content) {
			response.send(content, 200);
		}).catch(function(e) {
			response.send("Error while reading public/views/welcome.html: " + e, 500);
		});
	});

	app.post("/sign-in", function(request, response) {
		var email = request.body.email;
		var password = request.body.password;
		var staySignedIn = request.body.staySignedIn == "true";

		return repositories.User.getOne({ emailAddress: email }, "project").then(function(user) {
			if (!user) {
				response.send(401);
				return;
			}

			if (crypto.createHash(config.hashAlgorithm).update(user.salt + password).digest("hex") === user.password) {
				if (!user.session)
					user.session = csprng(512, 36);
				user.expiration = staySignedIn ? Date.now() + 1000*60*60*24*7*2 : null;
				response.cookie("session", user.session, staySignedIn ? { maxAge: 1000 * 60 * 60 * 24 * 7 * 2 } : { expires: false });
				return Promise.all([
					mapper.map("user", "user-view-model", user),
					mapper.map("project", "project-view-model", user.project)
				]).spread(function(user, project) {
					return repositories.User.update(user).then(function() {
						response.send({
							user: user,
							project: project
						}, 200);
					});
				});
			} else
				response.send(401);
		}).catch(function(e) {
			response.send("Error signing in: " + e, 500);
		});
	});
};