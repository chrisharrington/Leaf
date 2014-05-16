var fs = require("fs");
var models = require("../data/models");
var config = require("../config");
var mapper = require("../data/mapping/mapper");
var repositories = require("../data/repositories");
var authenticate = require("../authentication/authenticate");
var providers = require("../integration/providers");

var Promise = require("bluebird");

var base = Object.spawn(require("./baseController"));

module.exports = function(app) {
	app.post("/hook/:provider", function (request, response) {
		return repositories.Integration.get({ name: request.params.provider.toLowerCase() }).then(function(integrations) {
			var provider = providers.call(this, request.params.provider.toLowerCase());
			return Promise.all(integrations.map(function(current) {
				return provider.handle(current, request.body);
			}));
		}).then(function () {
			response.send(200);
		}).catch(function (e) {
			response.send(e.stack.formatStack(), 500);
		});
	});
};