var fs = require("fs");
var passport = require("passport");

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



		response.end();
	});
};