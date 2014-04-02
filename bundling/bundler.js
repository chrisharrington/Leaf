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

exports.buildOrderedFileList = function(assets, files) {
	return Promise.reduce(assets, function(list, asset) {
		return fs.statAsync(asset).then(function(info) {
			if (!info.isDirectory()) {
				list.push(asset);
				return list;
			} else
				return fs.readdirAsync(asset).then(function(newAssets) {
					return exports.buildOrderedFileList(newAssets.map(function(curr) {
						return asset + "/" + curr;
					}), list);
				});
		});
	}, files);
};

exports.bundleCss = function(directory, minify, callback) {
    _getAllFilesIn(directory, [".css", ".less"], function(err, files) {
	    if (err)
	        console.log("Error while bundling: " + err);
	    _concatenateAllFiles(directory, files, function(concatenated) {
	        _less.render(concatenated, function(error, css) {
		        if (error)
		            console.log("Error while performing LESS conversion: " + error);
	            if (minify)
	                css = new _compressor().minify(css);
	            callback(css);
	        });
	    });
    });
};