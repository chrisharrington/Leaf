var Promise = require("bluebird");
var bundler = require("../bundling/bundler");
var assets = require("../bundling/assets");
var config = require("../config");

var base = Object.spawn(require("./baseController"));

module.exports = function(app) {
	app.get("/project/settings", function (request, response) {
		return base.view("public/views/project.html", response, {
			domain: config.call(this, "domain")
		});
	});
};