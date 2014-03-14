(function() {

    var _http = require("http");
    var _routes = {};
    var _controllers = {
        welcome: require("./../controllers/welcome")
    };

    exports.listen = function(port) {
        _http.createServer(function(request, response) {
            var callback = _findCallback(request.method, request.url);
            if (!callback) {
                response.writeHead(404, { "Content-Type": "text/plain" });
                response.write("No route for " + request.url + " was found.");
                response.end();
            } else {
                callback(request, response);
            }
        }).listen(port);
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
        return _controllers[slash == -1 ? url : url.substring(0, slash)];
    }

    function _findAction(url, controller) {
        var slash = url.lastIndexOf("/");
        if (slash == -1)
            return url;

        var action = url.substring(slash+1);
        return controller[action] ? controller[action] : controller.index;
    }

})();