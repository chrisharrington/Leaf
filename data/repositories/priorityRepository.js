module.exports = Object.spawn(require("./baseRepository"), {
	model: require("../models").Priority,
	sort: { order: 1 }
});