var fs = require("fs");
var models = require("../data/models");
var config = require("../config");
var mapper = require("../data/mapping/mapper");
var repositories = require("../data/repositories");
var authenticate = require("../authentication/authenticate");

var Promise = require("bluebird");

var base = Object.spawn(require("./baseController"));

module.exports = function(app) {
	app.get("/search", authenticate, function(request, response) {
		return base.view("public/views/search.html", response);
	});

	app.get("/search/query", authenticate, function (request, response) {
		var text = request.query.text;
		return _searchForIssues(text).then(function(issues) {
			response.send({
				issues: issues
			}, 200);
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	});

	function _searchForIssues(text) {
		var query;
		if (text[0] == "#")
			query = repositories.Issue.get({ number: parseInt(text.substring(1)) });
		else
			query = require("../data/models").Issue.textSearchAsync(text).then(function(result) {
				var split = text.split(" "), issues = [], objects = result.results;
				for (var i = 0; i < objects.length; i++)
					issues.push(objects[i].obj);
				return issues;
			});

		return query.then(function(issues) {
			var split = text.split(" ");
			return mapper.mapAll("issue", "issue-view-model", issues).map(function(mapped) {
				return _highlightFoundValues(mapped, split);
			});
		});
	}

	function _highlightFoundValues(mapped, split) {
		for (var i = 0; i < split.length; i++) {
			var value = split[i];
			mapped.description = mapped.description.replace(new RegExp(value, "ig"), _replacer);
			mapped.details = mapped.details.replace(new RegExp(value, "ig"), _replacer);
		}
		return mapped;
	}

	function _replacer(match) {
		return "<b>" + match + "</b>";
	}
};