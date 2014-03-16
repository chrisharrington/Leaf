var _mustache = require("mustache");
var _fs = require("fs");

var _rootContent;

exports.inject = function(html) {
    var root = _getRootContent(function(root) {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(_mustache.render(root, { body: html }));
        response.end();
    });
};

function _getRootContent(callback) {
    if (_rootContent)
        callback(_rootContent);
    else {
        _fs.readFile("../view/root.html", function(err, content) {
            _rootContent = content;
            callback(_rootContent);
        });
    }
}