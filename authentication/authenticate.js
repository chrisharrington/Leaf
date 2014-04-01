var repositories = require("../data/repositories");

var Promise = require("bluebird");

module.exports = function(request, response, next) {
	return new Promise(function(resolve, reject) {
		if (!request.cookies.session)
			response.send(401);
		else
			return repositories.User.get({ session: request.cookies.session });
	}).then(function(users) {
		request.user = users[0];
		if (!request.user || (request.user.expiration != null && request.user.expiration < Date.now()))
			response.send(401);
		else
			request.project = request.user.project;
		next();
	}).catch(function (e) {
		response.send("Error while authenticating: " + e, 401);
	});
};