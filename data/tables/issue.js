exports.table = "issues";

exports.build = function(connection) {
	return connection.schema.createTable(exports.table, function (table) {
		table.increments("id");
		table.timestamps();
		table.boolean("isDeleted").notNullable().defaultTo(false);
		table.string("name").notNullable();
		table.text("description").notNullable();
		table.date("closed");
		table.integer("number");

		table.integer("priorityId").notNullable().references("priorities.id");
		table.integer("developerId").notNullable().references("users.id");
		table.integer("testerId").notNullable().references("users.id");
		table.integer("statusId").notNullable().references("statuses.id");
		table.integer("milestoneId").notNullable().references("milestones.id");
		table.integer("issueTypeId").notNullable().references("issuetypes.id");
		table.integer("projectId").notNullable().references("projects.id");
	});
};