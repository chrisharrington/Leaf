var _fs = require("fs");

exports.index = function(request, response) {
    _fs.readFile("public/views/root.html", function(err, content) {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(content);
        response.end();
    });
};