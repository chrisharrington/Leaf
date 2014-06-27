module.exports = function(connection) {
	return module.exports = Object.spawn(require("./baseRepository"), {
		table: "projects",
		connection: connection
	});
};

