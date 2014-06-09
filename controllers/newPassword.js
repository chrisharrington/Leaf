var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));
var mustache = require("mustache");
var mapper = require("../data/mapping/mapper");
var repositories = require("../data/repositories");
var authenticate = require("../authentication/authenticate");
var authorize = require("../authentication/authorize");
var emailer = require("../email/emailer");
var config = require("../config");
var csprng = require("csprng");
var crypto = require("crypto");
var mongoose = require("mongoose");
var hash = require("../authentication/hash");

var base = Object.spawn(require("./baseController"));

module.exports = function(app) {
	app.get("/new-password", function (request, response) {
		return base.view("public/views/newPassword.html", response);
	});

	app.post("/new-password", authenticate, function(request, response) {
		return repositories.User.one({ emailAddress: request.body.email, newPasswordToken: request.body.token }).then(function(user) {
			if (!user) {
				response.send(401);
				return;
			}

			user.salt = csprng.call(this, 128, 36);
			user.password = crypto.createHash(config("hashAlgorithm")).update(user.salt + request.body.password).digest("hex");
			user.newPasswordToken = null;
			return repositories.User.update(user).then(function() {
				response.send(200);
			}).catch(function(e) {
				response.send(e.stack.formatStack(), 500);
			});
		});
	});
};