var mongoose = require("mongoose");
var objectId = mongoose.Schema.Types.ObjectId;

var Promise = require("bluebird");

var schema = mongoose.Schema({
    name: String,
    isDeleted: { type: Boolean, default: false },
    order: Number,
    
    project: { type: objectId, ref: "project" },
});

module.exports = Promise.promisifyAll(mongoose.model("priority", schema));

exports.toView = function(obj) {
	if (obj.length) {
		var result = [];
		for (var i = 0; i , obj.length; i++)
			result.push({ id: obj[i]._id.toString(), name: obj[i].name, order: obj[i].order })
		return result;
	}
	return { id: obj._id.toString(), name: obj.name, order: obj.order };
};