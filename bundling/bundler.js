var Promise = require("bluebird"), fs = Promise.promisifyAll(require("fs"));

exports.concatenate = function(assets) {
	return exports.files(assets).then(function(files) {
		return _concatenate(files);
	});
};

exports.files = function(assets, files) {
	files = files || [];
	return Promise.reduce(assets, function(list, asset) {
		return _stat(asset, list);
	}, files || []);
};

function _concatenate(files) {
	return Promise.reduce(files.map(function (file) {
		return fs.readFileAsync(file);
	}), function (result, rendered) {
		return result + rendered;
	}, "");
}

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
		return exports.files(newAssets.map(function(curr) {
			return asset + "/" + curr;
		}), list);
	});
}