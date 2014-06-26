var Sequelize = require("sequelize");

exports.define = function(s) {
	return s.define("Status", {
		name: Sequelize.STRING,
		order: Sequelize.INTEGER,
		isClosedStatus: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
		isDeveloperStatus: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
		isTesterStatus: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
		isDeleted: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
	});
};

exports.associate = function(models) {
	models.Status.hasOne(models.Project);
};