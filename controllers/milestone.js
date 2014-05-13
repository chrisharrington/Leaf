var Promise = require("bluebird");
var repositories = require("../data/repositories");
var mapper = require("../data/mapping/mapper");
var authenticate = require("../authentication/authenticate");
var mongoose = require("mongoose");

var base = Object.spawn(require("./baseController"));

module.exports = function(app) {
//	app.post("/milestone/delete", authenticate, function(request, response) {
//
//	});

	app.post("/milestone/save", authenticate, function(request, response) {
		mapper.map("milestone-view-model", "milestone", request.body).then(function(milestone) {
			milestone.project = request.project._id;
			if (milestone._id)
				return repositories.Milestone.update(milestone);

			milestone._id = request.body.id = mongoose.Types.ObjectId();
			return repositories.Milestone.create(milestone);
		}).then(function(created) {
			response.send(request.body, 200);
		}).catch(function(e) {
			response.send(e.stack.formatStack(), 500);
		});
	});
};