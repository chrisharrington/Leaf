var Sequelize = require("sequelize");

exports.define = function(s) {
	return s.define("Priority", {
		name: Sequelize.STRING,
		order: Sequelize.INTEGER,
		colour: Sequelize.STRING,
		isDeleted: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
	});
};

exports.associate = function(models) {
	models.Priority.hasOne(models.Project);
};