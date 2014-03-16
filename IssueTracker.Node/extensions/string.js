String.prototype.startsWith = function(c) {
    return this.substring(0, c.length) == c;
};

String.prototype.endsWith = function(string) {
    return this.substring(this.length - string.length) == string;
};