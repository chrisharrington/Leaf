var Promise = require("bluebird"),
	less = require("less"),
	fs = Promise.promisifyAll(require("fs")),
	minifier = Promise.promisifyAll(require("yuicompressor")),
	compressor = require("clean-css");

var _env = "development";

exports.env = function(env) {
	_env = env;
};

exports.renderCss = function() {
	return new Promise(function(resolve) {
		resolve("css");
	});
};

exports.buildFileList = function(assets, files) {
	return Promise.reduce(assets, function(list, asset) {
		return fs.statAsync(asset).then(function(info) {
			if (!info.isDirectory()) {
				list.push(asset);
				return list;
			} else
				return fs.readdirAsync(asset).then(function(newAssets) {
					return exports.buildFileList(newAssets.map(function(curr) {
						return asset + "/" + curr;
					}), list);
				});
		});
	}, files || []);
};