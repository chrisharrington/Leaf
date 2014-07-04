var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("./setup");

var repositories = require("./../data/repositories");
var connection = require("./../data/connection");
var config = require("./../config");
var elasticsearch = require("elasticsearch");

var client = new elasticsearch.Client({
	host: config.call(this, "databaseLocation")
});

var max = 1000, count = 0;

var indexes = [];
for (var i = 0; i < max; i++)
	indexes.push({ create: { _index: "leaf", _type: "issues", _id: i+1 } }, _build(i))

repositories.Issue.removeAll({ formattedName: "leaf" }).then(function() {
	return client.bulk({
		body: indexes
	});
}).then(function() {
	return client.indices.refresh({ index: "issues" });
}).then(function() {
	console.log("Done!");
}).catch(function(e) {
	console.log(e.stack);
});

//client.index({
//	index: 'myindex',
//	type: 'mytype',
//	id: '1',
//	body: {
//		title: 'Test 1',
//		tags: ['y', 'z'],
//		published: true,
//	}
//}, function (error response) {
//
//});


function _build(index) {
	return {
		id: index + 1,
		number: index + 1,
		name: "test issue name",
		description: "test issue description",
		isDeleted: _random(2) % 1 == 0,
		opened: new Date(),
		closed: _random(3) % 2 == 0 ? new Date() : null,
		priorityId: _random(4),
		statusId: _random(6),
		milestoneId: _random(3),
		issueTypeId: _random(3),
		developerId: 1,
		testerId: 1,
		projectId: 1
	};
}

function _random(max) {
	return Math.floor((Math.random() * 100) + 1)%max;
}