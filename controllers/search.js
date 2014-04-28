var fs = require("fs");
var models = require("../data/models");
var config = require("../config");
var mapper = require("../data/mapping/mapper");
var repositories = require("../data/repositories");
var authenticate = require("../authentication/authenticate");

var Promise = require("bluebird");

module.exports = function(app) {
	app.get("/search", authenticate, function (request, response) {
		var text = request.query.text;
		return Promise.all([
			_searchForIssues(text)
		]).then(function(result) {
			response.send({
				issues: result[0]
			}, 200);
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	});

	function _searchForIssues(text) {
		var regex = new RegExp(text, "i");
		var properties = [{ name: regex }, { details: regex }];
		if (!isNaN(parseInt(text)))
			properties.push({ number: parseInt(text) });

		return new Promise(function(resolve, reject) {
			require("../data/models").Issue.find().or(properties).exec(function (err, data) {
				if (err) reject(err);
				else resolve(data);
			});
		}).then(function(issues) {
			return mapper.mapAll("issue", "issue-view-model", issues);
		});
	}
};