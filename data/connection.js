var Promise = require("bluebird");
var mongoose = require("mongoose");
var config = require("../config");

exports.connection = {};

exports.open = function() {
	return new Promise(function(resolve) {
		var connection = require("knex")({
			client: "pg",
			connection: {
				host: config.call(this, "databaseLocation"),
				user: config.call(this, "databaseUser"),
				password: config.call(this, "databasePassword"),
				database: "leaf"
			}
		});

		resolve(exports.connection = connection);
	});
};