var Promise = require("bluebird");
var bundler = require("./bundler");
var minifier = require("yuicompressor");
var fs = Promise.promisifyAll(require("fs"));

exports.render = function(assets, app) {
	return _deriveFileList(assets).then(function (files) {
		var promise = _buildInitialPromise(files, app);
		if (app.get("env") == "production")
			promise = _handleProduction(promise, app);
		return promise;
	});
};

function _handleProduction(promise, app) {
	return promise.then(function (concatenated) {
		return minifier.compressAsync(concatenated, { type: "js" });
	}).then(function (result) {
		var script = result[0];
		_setScriptRoute(app, script);
		return "<script type=\"text/javascript\" src=\"/script\"></script>";
	});
}

function _setScriptRoute(app, script) {
	app.get("/script", function (request, response) {
		response.writeHead(200, { "Content-Type": "text/javascript" });
		response.write(script);
		response.end();
	});
}

function _buildInitialPromise(files, app) {
	return Promise.reduce(files.map(function (file) {
		return app.get("env") == "production" ? fs.readFileAsync(file) : "<script type=\"text/javascript\" src=\"" + file.replace("./public", "") + "\"></script>\n";
	}), function (result, rendered) {
		return result + rendered;
	}, "");
}

function _deriveFileList(assets) {
	var files = [];
	return bundler.buildFileList(assets.map(function (curr) {
		return "./public/scripts/" + curr;
	}), files);
}