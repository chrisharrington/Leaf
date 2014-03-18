var _http = require("http");
var _utils = require("./utils");
var _router = require("./routing/router");
var _mime = require("mime");
var _fs = require("fs");

require("./extensions/string");
require("./controllers/welcome");

(function() {
	require("./data/models").init();
	
    // _http.createServer(function(request, response) {
    //     if (_isStaticFileRequest(request))
    //         _handleStaticFile(request, response);
    //     else
    //         _router.handle(request, response);
    // }).listen(process.env.PORT);
})();

function _isStaticFileRequest(request) {
    var url = request.url;
    if (url.indexOf("?") > -1)
        url = url.substring(0, url.indexOf("?"));
    return url.indexOf(".") > -1;
}

function _handleStaticFile(request, response) {
    var url = request.url;
    if (url.indexOf("?") > -1)
        url = url.substring(0, url.indexOf("?"));
    _fs.readFile("./public/" + url, function(err, content) {
        if (content) {
            response.writeHead(200, { "Content-Type": _mime.lookup(url) });
            response.write(content);
        } else {
            response.writeHead(404);
            response.write("No such file.");
        }
        response.end();
    });
}