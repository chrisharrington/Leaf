var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));
var mustache = require("mustache");
var mapper = require("../data/mapping/mapper");
var repositories = require("../data/repositories");
var authenticate = require("../authentication/authenticate");
var emailer = require("../email/emailer");
var config = require("../config");
var csprng = require("csprng");
var mongoose = require("mongoose");

module.exports = function(app) {
	app.get("/users", authenticate, function (request, response) {
		return Promise.all([
			fs.readFileAsync("public/views/users.html"),
			repositories.Issue.get({ project: request.project._id }),
			repositories.User.get()
		]).spread(function(html, issues, users) {
			var issuesByUser = _organizeIssuesByUser(issues);
			return mapper.mapAll("user", "user-summary-view-model", users).map(function(user) {
				user.developerIssueCount = issuesByUser[user.id] || 0;
				user.testerIssueCount = 0;
				return user;
			}).then(function(mapped) {
				response.send(mustache.render(html.toString(), { users: JSON.stringify(mapped) }), 200);
			});
		}).catch(function (e) {
			response.send(e.stack.formatStack(), 500);
		});

		function _organizeIssuesByUser(issues) {
			var organized = {};
			issues.forEach(function(issue) {
				if (!organized[issue.developerId])
					organized[issue.developerId] = 0;
				organized[issue.developerId]++;
			});
			return organized;
		}
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
};