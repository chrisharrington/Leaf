require("./extensions/string");
require("./extensions/number");

var express = require("express");
var app = express();
var config = require("./config");
var mapper = require("./data/mapper");
var bundler = require("./bundling/bundler");

require("./inheritance");

var Promise = require("bluebird");

_configureApplication();
_registerControllers();
_launchServer();

mapper.init();

function _configureApplication() {
	app.configure(function() {
		app.use(express.favicon(__dirname + "/public/images/favicon.ico"));
		app.use(express.compress());
		app.use(express.json());
		app.use(express.urlencoded());
		app.use(express.static(__dirname + "/public"));
		app.use(express.cookieParser());
	});

	app.configure("development", function() {
		app.set("env", "production");
	});

	app.configure("production", function() {
		app.set("env", "production");
	});
}

function _registerControllers() {
	require("./controllers/root")(app);
	require("./controllers/welcome")(app);
	require("./controllers/issues")(app);
	require("./controllers/notifications")(app);
}

function _launchServer() {
	var user;
	require("./data/connection").open().then(function() {
		app.listen(config.serverPort);
	}).then(function() {
		console.log("Server listening on port " + config.serverPort + " in " + app.get("env") + " mode.");
	}).catch(function(e) {
		console.log("Server failed to start: " + e);
	});
}
