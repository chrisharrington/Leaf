var Promise = require("bluebird");

var directory = "./caches/";
module.exports = {
	Priority: require(directory + "priorityCache"),
	Status: require(directory + "statusCache"),
	Transition: require(directory + "transitionCache"),
	IssueType: require(directory + "issueTypeCache"),
	Milestone: require(directory + "milestoneCache"),
	User: require(directory + "userCache")
};