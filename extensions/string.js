
String.prototype.endsWith = function(value) {
	if (!value)
		return false;
	if (value.length > this.length)
		return false;

	var end = this.substring(this.length - value.length);
	return end === value;
};

String.prototype.startsWith = function(value) {
	if (!value)
		return false;
	if (value.length > this.length)
		return false;

	return value === this.substring(0, value.length);
};

String.prototype.formatForUrl = function () {
	return this.replace(/[^a-z0-9]/gi, '-').toLowerCase();
};

String.prototype.capitalize = function() {
	return this[0].toUpperCase() + this.substring(1);
};

String.prototype.padLeft = function (paddingValue) {
	return String(paddingValue + this).slice(-paddingValue.length);
};