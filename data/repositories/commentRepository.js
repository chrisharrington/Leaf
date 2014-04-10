module.exports = Object.spawn(require("./baseIssueRepository"), {
	model: require("../models").Comment,
	sort: { name: 1 },
	populate: "issue user"
});