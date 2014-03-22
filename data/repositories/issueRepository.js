module.exports = Object.spawn(require("./baseRepository"), {
	model: require("../models").Issue,
	sort: { priority: -1, opened: 1 }
});