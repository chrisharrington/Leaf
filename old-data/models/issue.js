var mongoose = require("mongoose");
var objectId = mongoose.Schema.Types.ObjectId;

var schema = mongoose.Schema({
	number: Number,
	isDeleted: { type: Boolean, default: false },
	priorityId: { type: objectId },
	developerId: objectId,
	testerId: objectId,
	statusId: { type: objectId },
	milestoneId: { type: objectId },
	typeId: objectId,
	project: { type: objectId, ref: "project" },
	priorityOrder: { type: Number },
	opened: { type: Date, default: Date.now },

    name: String,
	details: String,
    closed: Date,
    updated: { type: Date, default: Date.now },
	updatedById: objectId
});

schema.plugin(require("mongoose-text-search"));

schema.index({ priorityOrder: -1, number: 1 });
//schema.index({ name: "text", details: "text" });

module.exports = require("bluebird").promisifyAll(mongoose.model("issue", schema));