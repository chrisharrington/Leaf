var models = require("../data/models");
var csprng = require("csprng");

var Promise = require("bluebird");

exports.auth = function(request, response, next) {
	_auth(request, response, next, true);
};

exports.authIgnoreSession = function(request, response, next) {
	_auth(request, response, next, false);
};

function _auth(request, response, next, updateSession) {
	if (!request.cookies.session)
		response.send(401);
	else {
		models.User.findOneAsync({ session: request.cookies.session }).then(function(user) {
			if (user.expiration != null && user.expiration < Date.now())
				response.send(401);
			else if (updateSession) {
				user.session = csprng(512, 36);
				response.cookie("session", user.session, { expires: user.expiration });
				return new Promise(function(resolve, reject) {
					user.save(function(err) {
						if (err) reject();
						else resolve(user);
					});
				});
			}
		}).then(function(user) {
			request.user = user;
			next();
		}).catch(function(e) {
			response.send("Error while authenticating: " + e, 401);
		});
	}
}