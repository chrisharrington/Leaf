exports.table = "issuefiles";

exports.build = function(connection) {
	return connection.schema.createTable(exports.table, function (table) {
		table.increments("id");
		table.timestamps();
		table.boolean("isDeleted").notNullable().defaultTo(false);
		table.string("container").notNullable();
		table.string("name").notNullable();
		table.decimal("size").notNullable();

		table.integer("issueId").notNullable().references("issues.id");
	});
};