var Promise = require("bluebird");

module.exports = function(connection) {
	return module.exports = Object.spawn(require("./baseRepository"), {
		connection: connection,
		table: "users"
	});
};