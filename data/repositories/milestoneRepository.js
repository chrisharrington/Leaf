module.exports = Object.spawn(require("./baseRepository"), {
	model: require("../models").Milestone,
	sort: { name: 1 }
});