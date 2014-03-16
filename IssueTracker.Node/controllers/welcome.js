var _fs = require("fs");

exports.index = function(request, response) {
    var content = _fs.readFileSync("views/welcome.html");
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write(content);
};