require("./extensions/string");
require("./extensions/number");
require("./inheritance");

var express = require("express");
var app = express();
var config = require("./config");
var mapper = require("./data/mapping/mapper");
var bundler = require("./bundling/bundler");
var caches = require("./data/caches");

var Promise = require("bluebird");

module.exports = function() {
	_configureApplication();
	_registerControllers();

	require("./data/connection").open().then(function () {
		return require("./data/caches").init();
	}).then(function() {
		return Promise.all([
			mapper.init(),
			caches.init()
		]);
	}).then(function () {
		app.listen(config("serverPort"));
	}).then(function () {
		console.log("Server listening on port " + config("serverPort") + " in " + app.get("env") + " mode.");
	}).catch(function (e) {
		console.log("Server failed to start: " + e);
	});
};

function _configureApplication() {
	app.configure(function () {
		app.use(express.favicon(__dirname + "/public/images/favicon.ico", { maxAge: 2592000000 }));
		app.use(express.compress());
		app.use(express.json());
		app.use(express.urlencoded());
		app.use(express.static(__dirname + "/public", { maxAge: 2592000000 }));
		app.use(express.cookieParser());
	});

	app.configure("development", function () {
		app.set("env", "development");
	});

	app.configure("production", function () {
		app.set("env", "production");
	});
}

function _registerControllers() {
	require("./controllers/root")(app);
	require("./controllers/welcome")(app);
	require("./controllers/issues")(app);
	require("./controllers/notifications")(app);
	require("./controllers/style")(app);
}