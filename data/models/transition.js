var mongoose = require("mongoose");
var objectId = mongoose.Schema.Types.ObjectId;

var schema = mongoose.Schema({
    name: String,
    isDeleted: { type: Boolean, default: false },
    
    project: { type: objectId, ref: "project" },
    from: { type: objectId, ref: "status" },
    to: { type: objectId, ref: "status" }
})

module.exports = mongoose.model("transition", schema);