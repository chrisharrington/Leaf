var moment = require("moment");
var config = require("../config");

var _maps = {};

exports.define = function(sourceKey, destinationKey, definition) {
	_maps[_getCombinedKey(sourceKey, destinationKey)] = definition;
};

exports.map = function(sourceKey, destinationKey, source) {
	try {
		if (source == null)
			return null;

		var key = _getCombinedKey(sourceKey, destinationKey);
		if (!_maps || !_maps[key])
			return source;

		var definition = _maps[key];
		var result = {};
		for (var name in definition) {
			var prop = definition[name];
			var type = typeof(prop);
			if (type == "function")
				prop = prop(source);
			else
				prop = source[prop];
			result[name] = prop;
		}
		return result;
	} catch (error) {
		console.log("Error during mapping: " + error);
		return source;
	}
};

exports.mapAll = function(sourceKey, destinationKey, sourceList) {
	var resultList = [];
	for (var i = 0; i < sourceList.length; i++)
		resultList.push(exports.map(sourceKey, destinationKey, sourceList[i]));
	return resultList;
};

exports.init = function() {
	exports.define("priority", "priority-view-model", { "id": "_id", name: "name", order: "order" });
	exports.define("status", "status-view-model", { "id": "_id", name: "name", order: "order" });
	exports.define("user", "user-view-model", { "id": "_id", name: "name", emailAddress: "emailAddress" });
	exports.define("transition", "transition-view-model", { "id": "id", name: "name" });
	exports.define("project", "project-view-model", { "id": "_id", name: "name" });
	exports.define("milestone", "milestone-view-model", { "id": "_id", name: "name" });
	exports.define("issue-type", "issue-type-view-model", { "id": "_id", name: "name" });
	exports.define("issue-file", "issue-file-view-model", { "id": "_id", name: "name", size: function(x) { return x.size.toSizeString(); } });
	exports.define("notification", "notification-view-model", {
		id: "_id",
		type: "type",
		isViewed: "isViewed",
		issue: function(x) {
            return x.issue == null ? null : { name: x.issue.name, number: x.issue.number, priority: x.issue.priority }		}
	});
	exports.define("comment", "issue-history-view-model", {
		date: function(x) { return moment(x.date).format(config.dateFormat);},
		text: "text",
		user: function(x) { return x.user.name; },
		issueId: function(x) { return x.issue._id; }
	});
	exports.define("issue-history-view-model", "comment", {
		date: function(x) { return moment(x.date, config.dateFormat); },
		text: "text"
	});
	exports.define("issue", "issue-view-model", {
		id: "_id",
		description: "name",
		details: "details",
		number: "number",
		milestone: "milestone",
		milestoneId: "milestoneId",
		priority: "priority",
		priorityId: "priorityId",
		status: "status",
		statusId: "statusId",
		tester: "tester",
		testerId: "testerId",
		developer: "developer",
		developerId: "developerId",
		type: "type",
		typeId: "typeId",
		priorityStyle: function(x) { return x.priority.toLowerCase(); },
		opened: function(x) { return moment(x.opened).format(config.dateFormat); },
		closed: function(x) { return x.closed ? moment(x.closed).format(config.dateFormat) : ""; },
		lastUpdated: function(x) { return moment(x.updated).format(config.dateFormat); },
		updatedBy: "updatedBy"
	});
	exports.define("issue-view-model", "issue", {
		"_id": "id",
		name: "description",
		details: "details",
		number: "number",
		milestone: "milestone",
		milestoneId: "milestoneId",
		priority: "priority",
		priorityId: "priorityId",
		status: "status",
		statusId: "statusId",
		tester: "tester",
		testerId: "testerId",
		developer: "developer",
		developerId: "developerId",
		type: "type",
		typeId: "typeId",
		opened: function(x) { return moment(x.opened, config.dateFormat); },
		closed: function(x) { return x.closed == "" || x.closed == null ? null : moment(x.closed, config.dateFormat); }
	});
};

function _getCombinedKey(source, destination) {
	return source + "|" + destination;
}