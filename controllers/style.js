var Promise = require("bluebird");
var bundler = require("../bundling/bundler");
var less = Promise.promisifyAll(require("less"));
var minifier = Promise.promisifyAll(require("yuicompressor"));
var assets = require("../bundling/assets");

module.exports = function(app) {
	var _cachedStyle;

	app.get("/style", function (request, response) {
		if (_cachedStyle)
			_sendStyle(response);
		else {
			return bundler.concatenate(assets.styles()).then(function (concatenated) {
				return less.renderAsync(concatenated);
			}).then(function (css) {
				return app.get("env") == "production" ? minifier.compressAsync(css, { type: "css" }) : [css];
			}).then(function (results) {
				_cachedStyle = results[0];
				_sendStyle(response);
			}).catch(function (e) {
				response.send(e.stack.formatStack(), 500);
			});
		}
	});

	function _sendStyle(response) {
		response.header("Content-Type", "text/css");
		response.header("Cache-Control", app.get("env") == "production" ? "public, max-age=2592000000" : "private, no-cache, max-age=0");
		response.send(_cachedStyle, 200);
	}
};