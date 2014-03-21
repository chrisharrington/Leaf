var fs = require("fs");
var crypto = require("crypto");
var models = require("../data/models");
var config = require("../config");
var csprng = require("csprng");

var Promise = require("bluebird");

module.exports = function(app) {
	app.get("/welcome", function(request, response) {
		fs.readFile("public/views/welcome.html", function(err, content) {
			response.send(content);
		});
	});

	app.post("/sign-in", function(request, response) {
		var email = request.body.email;
		var password = request.body.password;
		var staySignedIn = request.body.staySignedIn == "true";

		new Promise(function(resolve, reject) {
			models.User.findOne({ emailAddress: email }).populate("project").exec(function(err, user) {
				if (err)
					reject(err);
				else
					resolve(user);
			});
		}).then(function(user) {
			if (!user) {
				response.send(404);
				return;
			}

			if (crypto.createHash(config.hashAlgorithm).update(user.salt + password).digest("hex") === user.password) {
				var session = csprng(512, 36);
				response.cookie("session", session, staySignedIn ? { maxAge: 1000*60*60*24*7*2 } : { expires: false });
				response.send({
					user: { emailAddress: user.emailAddress, name: user.name },
					project: { name: user.project.name }
				}, 200);
			} else
				response.send(401);

			user.session = session;
			user.save();
		}).catch(function(e) {
			response.send("Error signing in: " + e, 500);
		});
	});
};