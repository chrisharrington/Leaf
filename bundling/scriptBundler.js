var Promise = require("bluebird");
var bundler = require("./bundler");
var minifier = Promise.promisifyAll(require("yuicompressor"));

exports.render = function(assets, app) {
	if (app.get("env") == "development")
		return _handleDevelopment(assets);
	return _handleProduction(assets, app);
};

function _handleDevelopment(assets) {
	return bundler.files(assets).then(function(files) {
		return files.reduce(function(result, file) {
			return result + "<script type=\"text/javascript\" src=\"" + file.replace("public/", "") + "\"></script>\n";
		}, "");
	});
}

function _handleProduction(assets, app) {
	return bundler.concatenate(assets).then(function(concatenated) {
		return minifier.compressAsync(concatenated);
	}).then(function(minified) {
		if (minified.length == 2)
			throw new Error("Error while minifying javascript: " + minified[1]);

		_addScriptRoute(minified, app);
		return "<script type=\"text/javascript\" src=\"/script\"></script>";
	});
}

function _addScriptRoute(minified, app) {
	app.get("/script", function(request, response) {
		response.header("Content-Type", "text/javascript");
		response.send(minified);
	})
}