String.prototype.formatForUrl = function () {
	return this.replace(/ /g, "-").replace(/[^a-z0-9\-]/gi, "").toLowerCase();
};