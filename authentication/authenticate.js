var models = require("../data/models");
var csprng = require("csprng");

var Promise = require("bluebird");

module.exports = function(request, response, next) {
	if (!request.cookies.session)
		response.send(401);
	else {
		models.User.findOneAsync({ session: request.cookies.session }).then(function(user) {
			if (user.expiration != null && user.expiration < Date.now())
				response.send(401);
			else {
				user.session = csprng(512, 36);
				return new Promise(function(resolve, reject) {
					user.save(function(err) {
						if (err) reject();
						else resolve(user);
					});
				});
			}
		}).then(function(user) {
			response.cookie("session", user.session, { expires: user.expiration });
			request.user = user;
			next();
		}).catch(function(e) {
			response.send("Error while authenticating: " + e, 401);
		});

	}
};