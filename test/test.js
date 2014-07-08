var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("./setup");

var repositories = require("./../data/repositories");
var config = require("./../config");
var elasticsearch = require("elasticsearch");

var client = new elasticsearch.Client({
	host: config.call(this, "databaseLocation")
});

var date = new Date();
_update1000TestIssues({ id: 1 }, 0).then(function() {
	console.log("Done!");
	console.log(new Date() - date);
});

function _update1000TestIssues(project, index) {
	var updates = [];
	for (var i = 0; i < 1000; i++) {
		updates.push({ update: { _index: project.id, _type: "issues", _id: (1000*index) + (i + 1) }});
		updates.push({ doc: { priorityOrder: 10 }});
	}
	return client.bulk({
		body: updates,
		refresh: true
	});
}