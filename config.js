var extend = require("node.extend");
var app = require("express")();

module.exports = function() {
	var env = app.get("env");
	switch (env) {
		case "development": return _dev();
		case "production": return _prod();
		default: throw new Error("No configuration for environment \"" + env + "\".");
	}
}();

function _dev() {
	console.log("Development configuration set.");
	return extend(_defaults(), {
		minify: false,
		serverPort: 8888
	});
}

function _prod() {
	console.log("Production configuration set.");
	return extend(_defaults(), {
		minify: true,
		serverPort: process.env.PORT
	});
}

function _defaults() {
	return {
		databaseConnectionString: "mongodb://IssueTrackerApp:C90BD87E-7267-4D55-B9A7-36B3581C3102@oceanic.mongohq.com:10038/issuetracker",
		hashAlgorithm: "sha512",
		dateFormat: "YYYY-MM-DD"
	};
}