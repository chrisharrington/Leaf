var fs = require("fs");
var authenticate = require("../authentication/authenticate");
var models = require("../data/models");
var mapper = require("../data/mapper");

module.exports = function(app) {
	app.get("/issues", authenticate, function(request, response) {
		fs.readFile("public/views/issues.html", function(err, content) {
			response.send(content);
		});
	});

	app.get("/issues/list", authenticate, function(request, response) {
		var start = parseInt(request.query.start);
		var end = parseInt(request.query.end);

		models.Issue
			.find()
			.populate("developer tester priority status milestone type updatedBy project")
			.skip(start-1)
			.limit(end-start+1).exec(function(err, issues) {
			if (err) response.send("Error retrieving issues: " + e, 500);
			else response.send(mapper.mapAll("issue", "issue-view-model", issues));
		});
	});
};