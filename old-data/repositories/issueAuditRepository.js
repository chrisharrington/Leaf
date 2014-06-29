module.exports = Object.spawn(require("./baseIssueRepository"), {
	model: require("../models").IssueAudit
});