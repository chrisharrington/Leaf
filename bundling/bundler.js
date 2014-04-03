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
		return _stat(asset, list);
	}, files || []);
};

function _stat(asset, list) {
	return fs.statAsync(asset).then(function(info) {
		return _handleAsset(info, list, asset);
	});
}

function _handleAsset(info, list, asset) {
	if (!info.isDirectory()) {
		list.push(asset);
		return list;
	}

	return _addFilesFromDirectory(asset, list);
}

function _addFilesFromDirectory(asset, list) {
	return fs.readdirAsync(asset).then(function(newAssets) {
		return exports.buildFileList(newAssets.map(function(curr) {
			return asset + "/" + curr;
		}), list);
	});
}