require("./extensions/string");

var express = require("express");
var app = express();
var config = require("./config");
var mapper = require("./data/mapper");
var moment = require("moment");

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
	mapper.define("priority", "priority-view-model", { "id": "_id", name: "name", order: "order" });
	mapper.define("status", "status-view-model", { "id": "_id", name: "name", order: "order" });
	mapper.define("user", "user-view-model", { "id": "_id", name: "name", emailAddress: "emailAddress" });
	mapper.define("transition", "transition-view-model", { "id": "id", name: "name" });
	mapper.define("project", "project-view-model", { "id": "_id", name: "name" });
	mapper.define("milestone", "milestone-view-model", { "id": "_id", name: "name" });
	mapper.define("issue-type", "issue-type-view-model", { "id": "_id", name: "name" });
	mapper.define("issue", "issue-view-model", {
		id: "_id",
		name: "name",
		description: "details",
		number: "number",
		milestone: function(x) { return x.milestone.name; },
		priority: function(x) { return x.priority.name; },
		tester: function(x) { return x.tester.name; },
		developer: function(x) { return x.developer.name; },
		status: function(x) { return x.status.name; },
		type: function(x) { return x.type.name; },
		priorityStyle: function(x) { return x.priority.name.toLowerCase(); },
		opened: function(x) { return moment(x.opened).format(config.dateFormat); },
		closed: function(x) { return x.closed ? moment(x.closed).format(config.dateFormat) : ""; },
		lastUpdated: function(x) { return moment(x.updated).format(config.dateFormat); },
		updatedBy: function(x) { return x.updatedBy.name; } });
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
