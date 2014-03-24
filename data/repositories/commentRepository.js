var Promise = require("bluebird");
var Comment = require("../models").Comment;

var repository = Object.spawn(require("./baseRepository"), {
	model: require("../models").Comment
});

repository.issue = function(issueId) {
	var me = this;
	return new Promise(function(resolve, reject) {
		me.model.find({ "issue": issueId }).populate("issue user").exec(function(err, comments) {
			if (err) reject(err);
			else resolve(comments);
		});
	}).catch(function(e) {
		console.log("Error during commentRepository.issue: " + e);
	});
};

repository.create = function(comment) {
	return this.model.createAsync(comment);
};

module.exports = repository;