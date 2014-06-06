var Promise = require("bluebird");
var bundler = require("./bundler");
var config = require("../config");
var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;

var _cachedScript;

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
	if (_cachedScript)
		return _buildScript(_cachedScript, app);
	else {
		return bundler.concatenate(assets).then(function (concatenated) {
			var ast = jsp.parse(concatenated);
			ast = pro.ast_mangle(ast);
			ast = pro.ast_squeeze(ast);
			return pro.gen_code(ast);
		}).then(function (minified) {
			if (!minified || minified == "")
				throw new Error("Error while minifying javascript: " + minified);

			_cachedScript = minified;
			return _buildScript(minified, app);
		});
	}
}

function _buildScript(script, app) {
	_addScriptRoute(script, app);
	var buildNumber = config.call(this, "buildNumber");
	return "<script type=\"text/javascript\" src=\"/script?v=" + (buildNumber ? buildNumber : Date.now()) + "\"></script>";
}

function _addScriptRoute(minified, app) {
	app.get("/script", function(request, response) {
		response.header("Content-Type", "text/javascript");
		response.header("Cache-Control", "public, max-age=2592000000");
		response.send(minified);
	});
}