var Promise = require("bluebird");
var bundler = require("./bundler");
var less = Promise.promisifyAll(require("less"));
var minifier = Promise.promisifyAll(require("yuicompressor"));

exports.render = function(assets, app) {
	return bundler.concatenate(assets).then(function(concatenated) {
		return less.renderAsync(concatenated);
	}).then(function(css) {
		return app.get("env") == "production" ? minifier.compressAsync(css, { type: "css" }) : [css];
	}).then(function(results) {
		var css = results[0];
		app.get("/style", function(request, response) {
			response.header("Content-Type", "text/css");
			response.header("Cache-Control", "public, max-age=2592000000");
			response.send(css);
		});
		return "<link rel=\"stylesheet\" href=\"/style?v=" + new Date().getTime() + "\" type=\"text/css\" />";
	});
};