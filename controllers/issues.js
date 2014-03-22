var fs = require("fs");
var authenticate = require("../authentication/authenticate");
var models = require("../data/models");
var mapper = require("../data/mapper");

module.exports = function(app) {
	app.get("/issues", authenticate.auth, function(request, response) {
		fs.readFile("public/views/issues.html", function(err, content) {
			response.send(content);
		});
	});

	app.get("/issues/list", authenticate.authIgnoreSession, function(request, response) {
		var start = parseInt(request.query.start);
		var end = parseInt(request.query.end);
		var direction = request.query.direction;
		var comparer = request.query.comparer;
		var sort = {};
		sort[comparer] = direction == "ascending" ? 1 : -1;

		models.Issue
			.find()
			.populate("developer")
			.populate("tester")
			.populate("status")
			.populate("milestone")
			.populate("type")
			.populate("updatedBy")
			.populate("project")
			.populate({ path: "priority", options: { sort: { "order": 1 }}})
			.skip(start-1)
			.limit(end-start+1)
			.exec(function(err, issues) {
			if (err) response.send("Error retrieving issues: " + e, 500);
			else response.send(mapper.mapAll("issue", "issue-view-model", issues));
		});
	});
};