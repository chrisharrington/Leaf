module.exports = function() {
	if (!process.env.NODE_ENV)
		process.env.NODE_ENV = "development";
	return process.env.NODE_ENV == "production" ? _prod() : _dev();
}();

function _dev() {
	var settings = _defaults();
	settings.serverPort = 8888;
	return settings;
}

function _prod() {
	var settings = _defaults();
	settings.serverPort = process.env.PORT;
	return settings;
}

function _defaults() {
	return {
		databaseConnectionString: "mongodb://IssueTrackerApp:C90BD87E-7267-4D55-B9A7-36B3581C3102@oceanic.mongohq.com:10038/issuetracker",
		hashAlgorithm: "sha512",
		dateFormat: "YYYY-MM-DD"
	};
}