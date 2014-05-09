var Promise = require("bluebird");
var bundler = require("../bundling/bundler");
var less = Promise.promisifyAll(require("less"));
var minifier = Promise.promisifyAll(require("yuicompressor"));
var assets = require("../bundling/assets");
var base = Object.spawn(require("./baseController"));

module.exports = function(app) {
	app.get("/project/settings", function (request, response) {
		return base.view("public/views/project.html", response);
	});
};