var Promise = require("bluebird");
var bundler = require("./bundler");
var minifier = require("yuicompressor");

exports.render = function(assets, app) {
	return bundler.render(assets, app, {
		productionHandler: exports.handleProduction,
		buildPerAssetDevRender: exports.buildPerAssetDevRender
	});
};

exports.buildPerAssetDevRender = function(file) {
	return "<script type=\"text/javascript\" src=\"" + file + "\"></script>\n";
};

exports.handleProduction = function(promise, app) {
	return promise.then(function (concatenated) {
		return minifier.compressAsync(concatenated, { type: "js" });
	}).then(function (result) {
		var script = result[0];
		_setScriptRoute(app, script);
		return "<script type=\"text/javascript\" src=\"/script\"></script>";
	});
};

exports.writeProductionScriptToResponse = function(request, response, script) {
	response.writeHead(200, { "Content-Type": "text/javascript" });
	response.write(script);
	response.end();
};

function _setScriptRoute(app, script) {
	app.get("/script", function(request, response) {
		exports.writeProductionScriptToResponse(request, response, script);
	});
}