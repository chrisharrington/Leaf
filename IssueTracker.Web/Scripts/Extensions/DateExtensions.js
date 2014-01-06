
Date.prototype.toReadableDateString = function () {
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	return months[this.getMonth()] + " " + this.getDate() + ", " + this.getFullYear();
};

Date.prototype.toLongDateString = function () {
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	return days[this.getDay()] + ", " + months[this.getMonth()] + " " + this.getDate() + ", " + this.getFullYear();
};

Date.prototype.toShortDateString = function () {
	return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate();
};

Date.prototype.toShortTimeString = function() {
	var hours = this.getHours();
	if (hours > 12)
		hours -= 12;
	if (hours == 0)
		hours = 12;
	return hours + ":" + this.getMinutes().toString().padLeft(2, "0") + " " + (this.getHours() >= 12 ? "PM" : "AM");
};

Date.prototype.toDateTimeString = function () {
	return this.toShortDateString() + " " + this.toLocaleTimeString();
};

Date.prototype.toServerReadableString = function () {
	return this.getFullYear() + "-" + (this.getMonth() + 1).toString().padLeft(2, "0") + "-" + this.getDate().toString().padLeft(2, "0") + " " + this.getHours().toString().padLeft(2, "0") + ":" + this.getMinutes().toString().padLeft(2, "0") + ":" + this.getSeconds().toString().padLeft(2, "0");
};

Date.prototype.clone = function () {
	return new Date(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds());
};

Date.getPastMonthRanges = function (count) {
	var dates = new Array();
	var beginning = new Date();
	beginning.setDate(1);
	for (var i = 0; i < count; i++) {
		var end = beginning.clone();
		end.setMonth(end.getMonth() + 1);
		end.setDate(end.getDate() - 1);
		dates.push({ start: beginning.clone(), end: end.clone() });
		beginning.setMonth(beginning.getMonth() - 1);
	}
	return dates;
};

Date.getPastWeekRanges = function (weeks) {
	var dates = new Array();
	var sunday = Date.getBeginningOfWeek();
	for (var i = 0; i < weeks; i++) {
		var end = sunday.clone();
		end.setDate(end.getDate() + 6);
		dates.push({ start: sunday.clone(), end: end.clone() });
		sunday.setDate(sunday.getDate() - 7);
	}
	return dates;
};

Date.getBeginningOfWeek = function (date) {
	date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	if (!date)
		date = new Date();
	while (date.getDay() != 0)
		date.setDate(date.getDate() - 1);
	return date;
};

Date.getMonthString = function(monthIndex) {
	return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][monthIndex];
};

Date.getDayString = function (dayIndex) {
	return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayIndex];
};

Date.parseUTC = function (string) {
	var date = new Date(Date.parse(string));
	date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
	return date;
};

Date.prototype.addDays = function (count) {
	var date = this.clone();
	date.setDate(date.getDate() + count);
	return date;
};

if (!Date.prototype.toISOString) {
	Date.prototype.toISOString = function () {
		function pad(n) { return n < 10 ? '0' + n : n }
		return this.getUTCFullYear() + '-'
            + pad(this.getUTCMonth() + 1) + '-'
            + pad(this.getUTCDate()) + 'T'
            + pad(this.getUTCHours()) + ':'
            + pad(this.getUTCMinutes()) + ':'
            + pad(this.getUTCSeconds()) + 'Z';
	};
}