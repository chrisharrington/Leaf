var directory = "./tables/";
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));

module.exports = function(connection) {
	var files = [
		"project",
		"permission",
		"user",
		"userPermission",
		"issueType",
		"milestone",
		"notification",
		"priority",
		"status",
		"issue",
		"issueFile"
	];

	var drop;
	files.reverse().forEach(function(file) {
		if (!drop)
			drop = _dropTable(file, connection);
		else
			drop = drop.then(function() {
				return _dropTable(file, connection);
			});
	});

	return drop.then(function() {
		var create;
		files.reverse().forEach(function(file) {
			if (!create)
				create = _createTable(file, connection);
			else
				create = create.then(function() {
					return _createTable(file, connection);
				});
		});
		return create;
	});
};

function _createTable(file, connection) {
	return require("./tables/" + file).build(connection);
}

function _dropTable(file, connection) {
	var table = require("./tables/" + file).table;
	return connection.schema.hasTable(table).then(function (exists) {
		return new Promise(function(resolve, reject) {
			if (exists)
				connection.schema.raw("DROP TABLE \"" + table + "\" CASCADE;").then(function() {
					resolve();
				});
			else
				resolve();
		});
	});
}