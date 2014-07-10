var extend = require("node.extend");

var _initialized = false;
var _config;

module.exports = function(key) {
	var config = {
		"databaseUser": "leaf-app",
		//"databaseLocation": "ds048487.mongolab.com:48487/leaf-experimental",
		"databaseLocation": "54.200.254.103:27017/leaf",
		"hashAlgorithm": "sha512",
		"dateFormat": "YYYY-MM-DD",
		"dateTimeFormat": "YYYY-MM-DD HH:mm:ss",
		"storageName" : "leafissuetracker",
		"sendgridUsername": "LeafIssueTracker",
		"fromAddress": "no-reply@leafissuetracker.com",
		"domain": "http://www.leafissuetracker.com",
		"serverPort": 8080,
		"buildNumber": require("./package.json").version
	};

	if (!_initialized) {
		try {
			extend(config, require("./secureConfig.json"));
		} catch (e) {}

		for (var name in config)
			process.env["leaf." + name] = config[name];
		_initialized = true;
	}

	return process.env["leaf." + key];
};