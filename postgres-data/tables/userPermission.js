exports.table = "userpermissions";

exports.build = function(connection) {
	return connection.schema.createTable(exports.table, function (table) {
		table.increments("id");
		table.timestamps();
		table.boolean("isDeleted").notNullable().defaultTo(false);
		table.boolean("isReadOnly").notNullable().defaultTo(false);

		table.integer("permissionId").notNullable().references("permissions.id");
		table.integer("userId").notNullable().references("users.id");
	});
};