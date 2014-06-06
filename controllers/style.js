var Promise = require("bluebird");
var bundler = require("../bundling/bundler");
var less = Promise.promisifyAll(require("less"));
var minifier = Promise.promisifyAll(require("yuicompressor"));
var assets = require("../bundling/assets");

module.exports = function(app) {
	app.get("/style", function (request, response) {
		return bundler.concatenate(assets.styles()).then(function(concatenated) {
			return less.renderAsync(concatenated);
		}).then(function(css) {
			//return app.get("env") == "production" ? minifier.compressAsync(css, { type: "css" }) : [css];
			return [css];
		}).then(function(results) {
			response.header("Content-Type", "text/css");
//			response.header("Cache-Control", app.get("env") == "production" ? "public, max-age=2592000000" : "private, no-cache, max-age=0");
			response.header("Cache-Control", "public, max-age=2592000000");
			response.send(results[0], 200);
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	});
};