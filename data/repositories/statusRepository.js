module.exports = Object.spawn(require("./baseRepository"), {
	model: require("../models").Status,
	sort: { order: 1 }
});