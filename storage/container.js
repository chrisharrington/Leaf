var Promise = require("bluebird");
var azure = require("azure");
var config = require("config");

exports.set = function(container, name, stream) {
	var service = azure.createBlobService(config.storageAccountName, config.storageAccountKey);
	service.createContainerIfNotExists(container, function(err) {
		service.createBlockBlobFromStream()
	});
};

exports.get = function(container, name) {

};