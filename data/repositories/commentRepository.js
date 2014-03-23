var Promise = require("bluebird");

var repository = Object.spawn(require("./baseRepository"), {
	model: require("../models").Comment
});

repository.issue = function(issueId) {
	var me = this;
	return new Promise(function(resolve, reject) {
		me.model.find({ "issue._id": issueId }).populate("issue user").exec(function(err, comments) {
			if (err) reject(err);
			else resolve(comments);
		});
	}).catch(function(e) {
		console.log("Error during commentRepository.issue: " + e);
	});
};

module.exports = repository;