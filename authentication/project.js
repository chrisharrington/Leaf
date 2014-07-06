var repositories = require("../data/repositories");
var Promise = require("bluebird");

var projects = {};

module.exports = function(request, response, next) {
	request.getProject = function() {
		var projectName = (request.host == "localhost" || request.host.endsWith("compute.amazonaws.com") ? "leaf" : request.host.split(".")[0]).toLowerCase();
		if (projects[projectName])
			return projects[projectName];
		
		return repositories.Project.one({ formattedName: projectName }).then(function(project) {
			projects[projectName] = project;
			return project;
		});
	};

	next();
};