require("./extensions/string");

var express = require("express");
var app = express();
var passport = require("passport"), LocalStrategy = require('passport-local').Strategy;

app.configure(function() {
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.static(__dirname + "/public"));
	app.use(passport.initialize());
	app.use(passport.session());
});

require("./controllers/bundle")(app);
require("./controllers/root")(app);
require("./controllers/welcome")(app);

passport.use(new LocalStrategy(function(username, password, done) {
	console.log("Authorizing: " + username + " / " + password + ".");
	require("./data/models").User.findOne({ username: username }, function (err, user) {
		if (err)
			return done(err);
		if (!user)
			return done(null, false);
		return done(null, user);
	});
}));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	require("./data/models").User.findByIdAsync(id).then(function(err, user) {
		done(err, user);
	});
});

var port = 8888;
app.listen(port, function() { console.log("Server listening on port %d.", port); });
