var fs = require("fs");
var authenticate = require("../authentication/authenticate");

module.exports = function(app) {
	app.get("/issues", authenticate, function(request, response) {
		fs.readFile("public/views/issues.html", function(err, content) {
			response.send(content);
		});
	});

	app.get("/issues/list", authenticate, function(request, response) {

	});
};