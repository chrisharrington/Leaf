var Sequelize = require("sequelize");

//leaf-database.coeeyohtv3yy.us-west-2.rds.amazonaws.com:3306
var sequelize = new Sequelize("leaf", "LeafAdmin", "boogity1!", {
	dialect: "mysql",
	host: "leaf-database.coeeyohtv3yy.us-west-2.rds.amazonaws.com",
	port: 3306
});
var models = require("./models")(sequelize);

sequelize.authenticate().complete(function(err) {
	if (!!err) {
		console.log('Unable to connect to the database:', err)
	} else {
		console.log('Connection has been established successfully.')
	}
});