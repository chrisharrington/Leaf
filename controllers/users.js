var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));
var mustache = require("mustache");
var mapper = require("../data/mapping/mapper");
var repositories = require("../data/repositories");
var authenticate = require("../authentication/authenticate");
var emailer = require("../email/emailer");
var config = require("../config");
var csprng = require("csprng");
var crypto = require("crypto");
var mongoose = require("mongoose");

var base = Object.spawn(require("./baseController"));

module.exports = function(app) {
	app.get("/users", authenticate, function (request, response) {
		return Promise.all([
			fs.readFileAsync("public/views/users.html"),
			repositories.Issue.issueCountsPerUser(request.project._id),
			repositories.User.get(null, { sort: { name: 1 }})
		]).spread(function(html, issueCounts, users) {
			return mapper.mapAll("user", "user-summary-view-model", users).map(function(user) {
				var counts = issueCounts[user.id] || { developer: 0, tester: 0 };
				user.developerIssueCount = counts.developer;
				user.testerIssueCount = counts.tester;
				return user;
			}).then(function(mapped) {
				response.send(mustache.render(html.toString(), { users: JSON.stringify(mapped) }), 200);
			});
		}).catch(function (e) {
			response.send(e.stack.formatStack(), 500);
		});
	});

	app.get("/users/profile", authenticate, function(request, response) {
		return base.view("public/views/profile.html", response);
	});

	app.post("/users/create", authenticate, function(request, response) {
		var user = { name: request.body.name, emailAddress: request.body.emailAddress };
		var error = _validate(user);
		if (error) {
			response.send(error, 400);
			return;
		}

		return mapper.map("user-view-model", "user", user).then(function(mapped) {
			var token = csprng.call(this, 128, 36);
			mapped.project = request.project._id;
			mapped.activationToken = token;
			mapped._id = mongoose.Types.ObjectId();
			return repositories.User.create(mapped).then(function() {
				    user.activationUrl = config.call(this, "domain").replace("www", request.project.name.formatForUrl()) + "/users/activate/" + token;
				user.projectName = request.project.name;
				return emailer.send(process.cwd() + "/email/templates/newUser.html", { user: user }, user.emailAddress, "Welcome to Leaf!");
			}).then(function() {
				response.send(mapped._id, 200);
			});
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});

		function _validate(user) {
			if (!user.name || user.name == "")
				return "The name is required.";
			if (!user.emailAddress || user.emailAddress == "")
				return "The email address is required.";
			if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(user.emailAddress))
				return "The email address is invalid.";
		}
	});

	app.post("/users/profile", authenticate, function(request, response) {
		return mapper.map("user-view-model", "user", request.body).then(function(user) {
			return repositories.User.save(user);
		}).then(function() {
			response.send(200);
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	});

	app.post("/users/delete", authenticate, function(request, response) {
		var id = request.body.id;
		if (!id) {
			response.send("Unable to delete user; no ID was provided.", 400);
			return;
		}

		return repositories.User.remove(id).then(function() {
			response.send(200);
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	});

	app.post("/users/change-password", authenticate, function(request, response) {
		var error = _validate(request);
		if (error) {
			response.send(error, 400);
			return;
		}

		request.user.salt = csprng.call(this, 512, 36);
		request.user.password = _hash(request.user.salt + request.body.password);
		return repositories.User.update(request.user).then(function() {
			response.send(200);
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});

		function _validate(request) {
			if (!request.body.current)
				return "The current password is missing.";
			if (!request.body.password)
				return "The new password is missing.";
			if (!request.body.confirmed)
				return "The confirmed password is missing.";
			if (request.body.password !== request.body.confirmed)
				return "The new and confirmed passwords don't match.";
			if (_hash(request.user.salt + request.body.current) !== request.user.password)
				return "The current password is incorrect.";
		}

		function _hash(text) {
			return crypto.createHash(config.call(this, "hashAlgorithm")).update(text).digest("hex");
		}
	});
};