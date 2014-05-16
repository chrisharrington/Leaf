var fs = require("fs");
var models = require("../data/models");
var config = require("../config");
var mapper = require("../data/mapping/mapper");
var repositories = require("../data/repositories");
var authenticate = require("../authentication/authenticate");

var Promise = require("bluebird");

var base = Object.spawn(require("./baseController"));

module.exports = function(app) {
	app.post("/hook/:provider", function (request, response) {
		return _getHookHandlerFrom(request).handle(request).then(function() {
			response.send(200);
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	});

	function _getHookHandlerFrom(request) {
		switch (request.params) {

		}
	}
};