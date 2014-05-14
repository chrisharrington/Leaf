var mongoose = require("mongoose");
var objectId = mongoose.Schema.Types.ObjectId;

var Promise = require("bluebird");

var schema = mongoose.Schema({
    name: String,
    isDeleted: { type: Boolean, default: false },
    order: Number,
	colour: String,
    
    project: { type: objectId, ref: "project" },
});

module.exports = Promise.promisifyAll(mongoose.model("priority", schema));