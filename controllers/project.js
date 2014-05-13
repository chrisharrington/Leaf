var Promise = require("bluebird");
var authenticate = require("../authentication/authenticate");
var config = require("../config");

var base = Object.spawn(require("./baseController"));

module.exports = function(app) {
	app.get("/project/settings", authenticate, function (request, response) {
		return base.view("public/views/project.html", response, {
			domain: config.call(this, "domain")
		});
	});
};