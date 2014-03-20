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
		var connection;
		var email = request.body.email;
		var password = request.body.password;
		var staySignedIn = request.body.staySignedIn;

		require("../data/connection").open().then(function(c) {
			connection = c;
			return models.User.findOneAsync({ emailAddress: email });
		}).then(function(user) {
			if (!user) {
				response.send(404);
				return;
			}

			response.send(crypto.createHash(config.hashAlgorithm).update(user.salt + password).digest("hex") === user.password ? 200 : 401);
		}).catch(function(e) {
			response.send("Error: " + e, 500);
		}).finally(function() {
			connection.close();
			response.end();
		});
	});
};