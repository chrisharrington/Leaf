module.exports = function(connection) {
	return module.exports = Object.spawn(require("./baseRepository"), {
		table: "issuetypes",
		connection: connection
	});
};