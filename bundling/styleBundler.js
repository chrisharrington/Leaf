var Promise = require("bluebird");
var bundler = require("./bundler");
var less = Promise.promisifyAll(require("less"));

exports.render = function(assets, app) {
	return bundler.render(assets, app, {
		productionHandler: exports.handleProduction,
		buildPerAssetDevRender: exports.buildPerAssetDevRender
	});
};

exports.buildPerAssetDevRender = function(file) {
	return "<link rel=\"stylesheet\" href=\"" + file.replace("public/", "") + "\" type=\"text/css\" />\n";
};

exports.handleProduction = function(promise, app) {
	return promise.then(function (concatenated) {
		return less.renderAsync(concatenated);
	}).then(function (css) {
		_setStyleRoute(app, css);
		return "<link rel=\"stylesheet\" href=\"/style\" type=\"text/css\" />";
	});
};

exports.writeProductionStyleToResponse = function(request, response, css) {
	response.writeHead(200, { "Content-Type": "text/css" });
	response.write(css);
	response.end();
};

function _setStyleRoute(app, css) {
	app.get("/style", function(request, response) {
		exports.writeProductionStyleToResponse(request, response, css);
	});
}