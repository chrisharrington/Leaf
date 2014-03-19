
var _http = require("http");
var _fs = require("fs");
var _routes = {};

exports.controllers = {
    welcome: require("./../controllers/welcome"),
    bundle: require("./../controllers/bundle"),
    root: require("./../controllers/root")
};

exports.handle = function(request, response) {
	if (request.url == "/")
		request.url = "/root";

	console.log("Looking for route for " + request.url + ".");
    var callback = _findCallback(request.method, request.url);
    if (!callback) {
		console.log("No callback found for " + request.url + ".");
        response.writeHead(404, { "Content-Type": "text/plain" });
        response.write("No route for " + request.url + " was found.");
        response.end();
    } else {
	    console.log("Callback found for " + request.url + ".");
        callback(request, response);
    }
};

function _findCallback(verb, url) {
    var controller = _findController(url);
    if (!controller)
        return;

    return _findAction(url, controller);
}

function _findController(url) {
    if (url.startsWith("/"))
        url = url.substring(1);

    var slash = url.indexOf("/");
    return exports.controllers[slash == -1 ? url : url.substring(0, slash)];
}

function _findAction(url, controller) {
    var slash = url.lastIndexOf("/");
    if (slash == -1)
        return url;

    var action = url.substring(slash+1);
    return controller[action] ? controller[action] : controller.index;
}