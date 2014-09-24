require("./extensions/string");
require("./extensions/number");
require("./extensions/array");
require("./inheritance");

var express = require("express");
var config = require("./config");
var mapper = require("./data/mapping/mapper");
var bundler = require("./bundling/bundler");
var caches = require("./data/newCaches");
var controllers = require("./controllers/controllers");
var connection = require("./data/connection");
var versiony = require("versiony");

var Promise = require("bluebird");

var MAX_AGE = 2592000000;

module.exports = function() {
	var app = express.call(this);
	_configureApplication(app);
	console.log("Starting...");
	return connection.open().then(function () {
		var inits = [];
		for (var name in caches)
			inits.push(caches[name].init());
		inits.push(controllers.init(app));
		inits.push(mapper.init());
		return Promise.all(inits);
	}).then(function () {
		versiony.from("package.json").patch().to("package.json");
		app.listen(config.call(this, "serverPort"));
		console.log("Server listening on port " + config.call(this, "serverPort") + " in " + app.get("env") + " mode.");
	}).catch(function (e) {
		console.log("Server failed to start.");
		console.log(e.stack);
	});
};

function _configureApplication(app) {
	app.configure(function () {
		app.use(require("./authentication/project"));
		app.use(express.favicon(__dirname + "/public/images/favicon.ico", { maxAge: MAX_AGE }));
		app.use(express.compress());
		app.use(express.json());
		app.use(express.urlencoded());
		app.use(express.static(__dirname + "/public", { maxAge: MAX_AGE }));
		app.use(express.cookieParser());
	});

	app.configure("development", function () { Promise.longStackTraces(); app.set("env", "development"); });
	app.configure("production", function () { app.set("env", "production"); });
}