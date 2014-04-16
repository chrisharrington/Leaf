var extend = require("node.extend");

var _initialized = false;

module.exports = function(key) {
	var config = {
		"databaseUser": "IssueTrackerApp",
		"hashAlgorithm": "sha512",
		"dateFormat": "YYYY-MM-DD",
		"dateTimeFormat": "YYYY-MM-DD HH:mm:ss",
		"storageName" : "leaf",
		"sendgridUsername": "LeafIssueTracker",
		"fromAddress": "no-reply@leafissuetracker.com",
		"domain": "http://leafissuetracker.com",
		"serverPort": process.env.PORT || 8888
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