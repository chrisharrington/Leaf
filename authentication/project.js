var repositories = require("../data/repositories");
var Promise = require("bluebird");

module.exports = function(request, response, next) {
	request.getProject = function() {
		var projectName = (request.host == "localhost" ? "Leaf" : request.host.split(".")[0]).toLowerCase();
		return repositories.Project.one({ formattedName: projectName });
	};

	next();
};