var Promise = require("bluebird");
var mongoose = require("mongoose");
var config = require("../config");

exports.open = function() {
	return new Promise(function(resolve, reject) {
		mongoose.connect("mongodb://" + config.call(this, "databaseUser") + ":" + config.call(this, "databasePassword") + "@oceanic.mongohq.com:10038/issuetracker", { server: { socketOptions: { keepAlive: 1 } } });

		var connection = mongoose.connection;
		connection.on("error", function(error) { console.log("Error connecting to database: " + error); reject(new Error(error));	});
		connection.on("open", function() { console.log("Database connection established."); resolve(connection); });
	});
};