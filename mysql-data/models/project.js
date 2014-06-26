var Sequelize = require("sequelize");

exports.define = function(s) {
	return s.define("Project", {
		name: Sequelize.STRING,
		formattedName: Sequelize.STRING,
		isDeleted: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
	});
};