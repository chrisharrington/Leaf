var Promise = require("bluebird");

var repository = Object.spawn(require("./baseRepository"), {
	table: "sequences"
});

repository.next = function(name) {
	return this.conncetion().where({ id: name }).returning("sequence").increment("sequence", 1);
};

module.exports = repository;