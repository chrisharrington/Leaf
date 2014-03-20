var fs = require("fs");
var passport = require("passport");
var crypto = require("crypto");
var models = require("../data/models");
var config = require("../config");

module.exports = function(app) {
	app.get("/welcome", function(request, response) {
		fs.readFile("public/views/welcome.html", function(err, content) {
			response.send(content);
		});
	});

	app.post("/sign-in", function(request, response) {
		var email = request.body.email;
		var password = request.body.password;
		var staySignedIn = request.body.staySignedIn;

		models.User.findOne({ emailAddress: email }).populate("project").exec(function(err, user) {
			try {
				if (err || !user) {
					response.send(404, err || "");
					return;
				}

				if (crypto.createHash(config.hashAlgorithm).update(user.salt + password).digest("hex") === user.password) {
					response.send({
						user: { emailAddress: user.emailAddress, name: user.name },
						project: { name: user.project.name }
					}, 200);
				} else
					response.send(401);
			} catch (e) {
				response.send("Error: " + e, 500);
			}
		});
	});
};