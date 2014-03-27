var azure = require("azure");
var Promise = require("bluebird");
var config = require("../config");

exports.set = function(container, file) {
	return new Promise(function(resolve, reject) {
		var service = azure.createBlobService(config.storageName, config.storageKey);
		service.createContainerIfNotExists(container, function (err) {
			if (err)
				reject("Error creating container: " + err);
			else {
				service.createBlockBlobFromFile(container, file.name, file.path, function (err) {
					if (err)
						reject("Error while creating block blob from stream: " + err);

					resolve();
				})
			}
		});
	});
};

exports.get = function(container, name) {

};