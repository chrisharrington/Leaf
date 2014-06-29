exports.table = "users";

exports.build = function(connection) {
	return connection.schema.createTable(exports.table, function (table) {
		table.increments("id");
		table.timestamps();
		table.boolean("isDeleted").notNullable().defaultTo(false);
		table.string("name").notNullable();
		table.string("emailAddress").notNullable();
		table.string("phone");
		table.string("activationToken");
		table.string("salt");
		table.string("password");
		table.string("session");
		table.dateTime("expiration");
		table.string("newPasswordToken");
		table.boolean("emailNotificationForIssueAssigned").notNullable().defaultTo(true);
		table.boolean("emailNotificationForIssueDeleted").notNullable().defaultTo(false);
		table.boolean("emailNotificationForIssueUpdated").notNullable().defaultTo(false);
		table.boolean("emailNotificationForNewCommentForAssignedIssue").notNullable().defaultTo(false);

		table.integer("projectId").notNullable().references("projects.id");
	});
};