var extend = require("node.extend");

var _config;

module.exports = function(key) {
	if (!_config)
		_buildConfig();

	return _config[key];
};

function _buildConfig() {
	_config = {
		"databaseUser": "IssueTrackerApp",
		"hashAlgorithm": "sha512",
		"dateFormat": "YYYY-MM-DD",
		"dateTimeFormat": "YYYY-MM-DD HH:mm:ss",
		"storageName" : "leaf",
		"sendgridUsername": "LeafIssueTracker",
		"fromAddress": "no-reply@leafissuetracker.com",
		"domain": "http://www.leafissuetracker.com",
		"serverPort": process.env.PORT || 8888,
		"buildNumber": process.env.BUILD_NUMBER
	};

	try {
		extend(_config, require("./secureConfig.json"));
	} catch (e) {}
}