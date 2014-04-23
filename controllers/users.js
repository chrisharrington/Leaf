var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));
var mustache = require("mustache");
var mapper = require("../data/mapping/mapper");
var repositories = require("../data/repositories");
var authenticate = require("../authentication/authenticate");

module.exports = function(app) {
	app.get("/users", authenticate, function (request, response) {
		return Promise.all([
			fs.readFileAsync("public/views/users.html"),
			repositories.Issue.get({ project: request.project._id }),
			repositories.User.get()
		]).spread(function(html, issues, users) {
			var issuesByUser = _organizeIssuesByUser(issues);
			return mapper.mapAll("user", "user-summary-view-model", users).map(function(user) {
				user.developerIssueCount = issuesByUser[user.id];
				user.testerIssueCount = 0;
				return user;
			}).then(function(mapped) {
				response.send(mustache.render(html.toString(), { users: JSON.stringify(mapped) }), 200);
			});
		}).catch(function (e) {
			response.send(e.stack.formatStack(), 500);
		});
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
};