var repository = Object.spawn(require("./baseRepository"), {
	type: "projects"
});

repository.create = function(object) {
	return this.client.create({
		index: object.formattedName,
		type: "projects",
		body: object
	});
};

repository.remove = function(formattedName) {
	return this.client.deleteByQuery({
		index: formattedName,
		q: "formattedName:" + formattedName
	});
};

module.exports = repository;

