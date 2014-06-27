exports.table = "notifications";

exports.build = function(connection) {
	return connection.schema.createTable(exports.table, function (table) {
		table.increments("id");
		table.timestamps();
		table.boolean("isDeleted").notNullable().defaultTo(false);
		table.string("type").notNullable();
		table.boolean("isViewed").notNullable().defaultTo(false);
		table.text("comment").notNullable();

		table.integer("userid").notNullable().references("users.id");
	});
};