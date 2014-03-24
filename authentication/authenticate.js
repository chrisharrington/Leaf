var models = require("../data/models");

var Promise = require("bluebird");

module.exports = function(request, response, next) {
	if (!request.cookies.session)
		response.send(401);
	else {
		models.User.findOne({ session: request.cookies.session }).populate("project").exec(function(err, user) {
			if (err)
				response.send("Error while authenticating: " + err, 401);
			else {
				request.user = user;
				request.project = user.project;
				if (user.expiration != null && user.expiration < Date.now())
					response.send(401);
				next();
			}
		});
	}
};