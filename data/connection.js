var Promise = require("bluebird");
var mongoose = require("mongoose");
var config = require("../config");

exports.open = function() {
	return new Promise(function(resolve, reject) {
		mongoose.connect(config.databaseConnectionString, {
			server: {
				poolSize: 5,
				socketOptions: {
					keepAlive: 1
				}
			}
		});
		var connection = mongoose.connection;
		connection.on("error", function(error) { reject(error);	});
		connection.once("open", function() { resolve(connection); });
		process.on("exit", connection.close);
		process.on("SIGINT", connection.close);
		process.on("uncaughtException", connection.close);
	});
};