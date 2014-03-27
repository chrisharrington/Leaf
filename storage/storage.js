var azure = require("azure");
var Promise = require("bluebird");
var config = require("../config");

exports.set = function(container, id, name, path) {
	return new Promise(function(resolve, reject) {
		var service = azure.createBlobService(config.storageName, config.storageKey);
		service.createContainerIfNotExists(container, function (err) {
			if (err)
				reject("Error creating container: " + err);
			else {
				service.createBlockBlobFromFile(container, id + "-" + name, path, function (err, result) {
				if (err)
						reject("Error while creating block blob from stream: " + err);

					resolve({ container: result.container, id: id, name: result.blob });
				})
			}
		});
	});
};

exports.get = function(container, name) {

};