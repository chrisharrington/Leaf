var azure = require("azure");
var Promise = require("bluebird");
var config = require("../config");

exports.set = function(container, name, stream) {
	var service = azure.createBlobService(config.storageName, config.storageKey);
	service.createContainerIfNotExists(container, function(err) {
		if (err)
			console.log("Error creating container: " + err);
		else {
			service.createBlockBlobFromStream(container, name, stream, function(err) {
				if (err)
					console.log("Error while creating block blob from stream: " + err);
			})
		}
	})
};

exports.get = function(container, name) {

};