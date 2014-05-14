var mongoose = require("mongoose");
var objectId = mongoose.Schema.Types.ObjectId;

var schema = mongoose.Schema({
    name: String,
	details: String,
    number: Number,
    isDeleted: { type: Boolean, default: false, index: true },
    opened: { type: Date, default: Date.now },
    closed: Date,
    updated: { type: Date, default: Date.now },
	priorityId: objectId,
	priority: String,
	priorityOrder: Number,
	developerId: objectId,
    developer: String,
	testerId: objectId,
	tester: String,
	statusId: objectId,
	status: String,
	statusOrder: Number,
	milestoneId: objectId,
	milestone: String,
	typeId: objectId,
	type: String,
	updatedById: objectId,
	updatedBy: String,
    project: { type: objectId, ref: "project", index: true }
});

module.exports = require("bluebird").promisifyAll(mongoose.model("issue", schema));

//			project: projectId,
//			isDeleted: false,
//			priorityId: { $in: filter.priorities },
//			statusId: { $in: filter.statuses },
//			developerId: { $in: filter.developers },
//			testerId: { $in: filter.testers },
//			milestoneId: { $in: filter.milestones},
//			typeId: { $in: filter.types }