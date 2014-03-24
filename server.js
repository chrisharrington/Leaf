require("./extensions/string");

var express = require("express");
var app = express();
var config = require("./config");
var mapper = require("./data/mapper");
var moment = require("moment");

require("./inheritance");

var Promise = require("bluebird");

_configureApplication();
_registerControllers();
_launchServer();

mapper.init();

function _configureApplication() {
	app.configure(function() {
		app.use(express.json());
		app.use(express.urlencoded());
		app.use(express.static(__dirname + "/public"));
		app.use(express.cookieParser());
	});
}

function _registerControllers() {
	require("./controllers/bundle")(app);
	require("./controllers/root")(app);
	require("./controllers/welcome")(app);
	require("./controllers/issues")(app);
}

function _launchServer() {
	require("./data/connection").open().then(function() {
		app.listen(config.serverPort);
	}).then(function() {
		console.log("Server listening on port " + config.serverPort + ".");
	}).catch(function(e) {
		console.log("Server failed to start: " + e);
	});
}
