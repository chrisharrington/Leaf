var repositories = require("../data/repositories");
var models = require("../data/models");
var Promise = require("bluebird");

module.exports = function(request, response, next) {
	return repositories.User.get({ session: request.cookies.session }, "project").then(function(users) {
		request.user = users[0];
		if (!request.user || (request.user.expiration != null && request.user.expiration < Date.now()))
			response.send(401);
		else {
			response.cookie("session", request.user.session, { expires: request.user.expiration });
			request.project = request.user.project;
			next();
		}
	}).catch(function (e) {
		response.send(e.stack.formatStack(), 401);
	});
};