exports.table = "comments";

exports.build = function(connection) {
	return connection.schema.createTable(exports.table, function(table) {
		table.increments("id");
		table.timestamps();
		table.boolean("isDeleted").notNullable().defaultTo(false);
		table.text("text").notNullable();

		table.integer("issueId").references("issues.id");
		table.integer("userId").references("users.id");
	});
};