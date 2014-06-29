exports.table = "permissions";

exports.build = function(connection) {
	return connection.schema.createTable(exports.table, function (table) {
		table.increments("id");
		table.timestamps();
		table.boolean("isDeleted").notNullable().defaultTo(false);
		table.string("name").notNullable();
		table.string("tag").notNullable();
	});
};