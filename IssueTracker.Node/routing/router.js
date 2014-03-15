(function() {

    var _http = require("http");
    var _routes = {};

    exports.controllers = {
        welcome: require("./../controllers/welcome")
    };

    exports.listen = function(port) {
       this.server =  _http.createServer(exports.handle).listen(port);
    };

    exports.handle = function(request, response) {
        var callback = _findCallback(request.method, request.url);
        if (!callback) {
            response.writeHead(404, { "Content-Type": "text/plain" });
            response.write("No route for " + request.url + " was found.");
            response.end();
        } else {
            callback(request, response);
        }
    };

    exports.close = function() {
        this.server.close();
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

})();