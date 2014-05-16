var Promise = require("bluebird");
var authenticate = require("../authentication/authenticate");
var config = require("../config");
var repositories = require("../data/repositories");
var mapper = require("../data/mapping/mapper");

var base = Object.spawn(require("./baseController"));

module.exports = function(app) {
	app.get("/project/settings", authenticate, function (request, response) {
		repositories.Integration.get({ project: request.project._id }).then(function(integrations) {
			return mapper.map("integration", "integration-view-model", integrations);
		}).then(function(mapped) {
			return base.view("public/views/project.html", response, {
				domain: config.call(this, "domain"),
				integrations: JSON.stringify(mapped)
			});
		});
	});
};