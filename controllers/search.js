var fs = require("fs");
var models = require("../data/models");
var config = require("../config");
var mapper = require("../data/mapping/mapper");
var repositories = require("../data/repositories");

var Promise = require("bluebird");

module.exports = function(app) {
	app.get("/search", function (request, response) {
		var text = request.query.text;
		return Promise.all([
			_searchForIssues(text)
		]).then(function(result) {
			response.send({
				issues: result[0]
			}, 200);
		});
	});

	function _searchForIssues(text) {
		var regex = new RegExp(text, "i");
		var models = require("../data/models");
//		return new Promise(function(resolve, reject) {
//			models.Issue.find({
//				name: { $regex: regex }
//			}, function(err, data) {
//				if (err) reject(err);
//				else resolve(data);
//			})
//		});
		return repositories.Issue.get({
			name: { $regex: regex }
		}, {
			or: true
		});
	}
};