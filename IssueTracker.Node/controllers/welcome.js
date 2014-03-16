var _fs = require("fs");
var _base = require("./base");

exports.index = function(request, response) {
    _fs.readFile("view/welcome.html", function(err, content) {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(content);
        response.end();
    });
};