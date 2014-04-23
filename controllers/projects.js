var fs = require("fs");
var models = require("../data/models");
var crypto = require("crypto");
var config = require("../config");
var csprng = require("csprng");
var mapper = require("../data/mapping/mapper");
var repositories = require("../data/repositories");

var Promise = require("bluebird");
module.exports = function(app) {
	app.get("/projects", function(request, response) {
		return fs.readFileAsync("public/views/projects.html").then(function(content) {
			response.send(content, 200);
		}).catch(function(e) {
			response.send("Error while reading public/views/projects.html: " + e, 500);
		});
	});
};