var Promise = require("bluebird"), fs = Promise.promisifyAll(require("fs"));

exports.render = function(assets, app, config) {
	_validateConfig(config);

	return _buildFileList(assets).then(function (files) {
		var promise = _buildInitialPromise(files, app, config);
		if (app.get("env") == "production")
			promise = config.productionHandler(promise, app);
		return promise;
	});
};

function _validateConfig(config) {
	if (!config.productionHandler)
		throw new ReferenceError("Missing production handler for bundler.");
	if (!config.buildPerAssetDevRender)
		throw new ReferenceError("Missing per asset dev render for bundler.");
}

function _buildInitialPromise(files, app, config) {
	return Promise.reduce(files.map(function (file) {
		return app.get("env") == "production" ? fs.readFileAsync(file) : config.buildPerAssetDevRender(file);
	}), function (result, rendered) {
		return result + rendered;
	}, "");
}

function _buildFileList(assets, files) {
	files = files || [];
	return Promise.reduce(assets, function(list, asset) {
		return _stat(asset, list);
	}, files || []);
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
		return _buildFileList(newAssets.map(function(curr) {
			return asset + "/" + curr;
		}), list);
	});
}