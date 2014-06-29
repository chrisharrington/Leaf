var Promise = require("bluebird");
var mongoose = require("mongoose");
var config = require("../config");

exports.connection = {};

exports.open = function() {
	return new Promise(function(resolve) {
		var connection = require("knex")({
			client: "pg",
			connection: {
				host: "leaf-db-identifier.coeeyohtv3yy.us-west-2.rds.amazonaws.com",
				user: "LeafApp",
				password: "boogity1!",
				database: "leaf"
			}
		});

		resolve(exports.connection = connection);
	});
};