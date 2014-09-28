String.prototype.formatForUrl = function () {
	return this.replace(/ /g, "-").replace(/[^a-z0-9\-]/gi, "").toLowerCase();
};

String.prototype.startsWith = function(value) {
	if (!value || value.length > this.length)
		return false;

	return this.substring(0, value.length) === value;
};

String.prototype.endsWith = function(value) {
	if (!value)
		return false;
	if (value.length > this.length)
		return false;

	var end = this.substring(this.length - value.length);
	return end === value;
};


String.prototype.formatStack = function() {
	return this.replace(/\n/g, "<br>&nbsp;&nbsp;&nbsp;&nbsp;");
};