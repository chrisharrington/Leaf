module.exports = Object.spawn(require("./baseCache"), {
	repository: require("../repositories").IssueType,
	sort: { name: 1 }
});