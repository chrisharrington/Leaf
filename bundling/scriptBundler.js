var Promise = require("bluebird");
var bundler = require("./bundler");
var minifier = Promise.promisifyAll(require("yuicompressor"));

exports.render = function(assets, app, timestamp) {
	if (app.get("env") == "development")
		return _handleDevelopment(assets);
	return _handleProduction(assets, app, timestamp);
};

function _handleDevelopment(assets) {
	return bundler.files(assets).then(function(files) {
		return files.reduce(function(result, file) {
			return result + "<script type=\"text/javascript\" src=\"" + file.replace("public/", "") + "\"></script>\n";
		}, "");
	});
}

function _handleProduction(assets, app, timestamp) {
	return bundler.concatenate(assets).then(function(concatenated) {
		return minifier.compressAsync(concatenated);
	}).then(function(minified) {
		if (minified[1] != "")
			throw new Error("Error while minifying javascript: " + minified[1]);

		_addScriptRoute(minified[0], app);
		return "<script type=\"text/javascript\" src=\"/script?v=" + (timestamp || new Date().getTime()) + "\"></script>";
	});
}

function _addScriptRoute(minified, app) {
	app.get("/script", function(request, response) {
		response.header("Content-Type", "text/javascript");
		response.header("Cache-Control", "public, max-age=2592000000");
		response.send(minified);
	});
}