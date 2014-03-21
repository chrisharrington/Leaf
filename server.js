require("./extensions/string");

var express = require("express");
var app = express();
var config = require("./config");
var mapper = require("./data/mapper");

var Promise = require("bluebird");

_configureApplication();
_registerControllers();
_registerMappings();
_launchServer();

function _configureApplication() {
	app.configure(function() {
		app.use(express.json());
		app.use(express.urlencoded());
		app.use(express.static(__dirname + "/public"));
		app.use(express.cookieParser());
		app.use(express.session({ secret: "a super secret session secret dealie" }));
	});
}

function _registerControllers() {
	require("./controllers/bundle")(app);
	require("./controllers/root")(app);
	require("./controllers/welcome")(app);
	require("./controllers/issues")(app);
}

function _registerMappings() {
	mapper.define("priority", "priority-view-model", { "_id": "id", name: "name", order: "order" });
	mapper.define("status", "status-view-model", { "_id": "id", name: "name", order: "order" });
	mapper.define("user", "user-view-model", { "_id": "id", name: "name", emailAddress: "emailAddress" });
	mapper.define("transition", "transition-view-model", { "_id": "id", name: "name" });
	mapper.define("project", "project-view-model", { "_id": "id", name: "name" });
	mapper.define("milestone", "milestone-view-model", { "_id": "id", name: "name" });
	mapper.define("issue-type", "issue-type-view-model", { "_id": "id", name: "name" });
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