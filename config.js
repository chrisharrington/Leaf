var extend = require("node.extend");

var _initialized = false;
var _config;

module.exports = function(key) {
	var config = {
		"databaseUser": "IssueTrackerApp",
		"databaseLocation": "ds048537.mongolab.com:48537/leaf-experimental",
		"hashAlgorithm": "sha512",
		"dateFormat": "YYYY-MM-DD",
		"dateTimeFormat": "YYYY-MM-DD HH:mm:ss",
		"storageName" : "leafissuetracker",
		"sendgridUsername": "LeafIssueTracker",
		"fromAddress": "no-reply@leafissuetracker.com",
		"domain": "http://www.leafissuetracker.com",
		"serverPort": process.env.PORT || 8888,
		"buildNumber": process.env.BUILD_NUMBER
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