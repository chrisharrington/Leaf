var _fs = require("fs");
var _base = require("./base");

exports.index = function(request, response) {
    _fs.readFile("views/welcome.html", function(err, content) {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(content);
        response.end();
    });
};