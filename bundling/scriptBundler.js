var Promise = require("bluebird");
var bundler = require("./bundler");
var minifier = require("yuicompressor");
var fs = Promise.promisifyAll(require("fs"));

exports.render = function(directory, app) {
	var files = [];
	return fs.readdirAsync(directory).then(function(scripts) {
		return bundler.buildFileList(scripts.map(function(curr) {
			return "./public/scripts/" + curr;
		}), files);
	}).then(function () {
		var promise = Promise.reduce(files.map(function (file) {
			return app.get("env") == "production" ? fs.readFileAsync(file) : "<script type=\"text/javascript\" src=\"" + file.replace("./public", "") + "\"></script>\n";
		}), function (result, rendered) {
			return result + rendered;
		}, "");
		if (app.get("env") == "production")
			promise = promise.then(function (concatenated) {
				return minifier.compressAsync(concatenated, { type: "js" }).then(function (result) {
					var script = result[0];
					app.get("/script", function (request, response) {
						response.writeHead(200, { "Content-Type": "text/javascript" });
						response.write(script);
						response.end();
					});
					return "<script type=\"text/javascript\" src=\"/script\"></script>";
				});
			});
		return promise;
	});
};