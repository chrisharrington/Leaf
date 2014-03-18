var _fs = require("fs");
var _prioritiesRepository = require("./../data/repositories/prioritiesRepository");

var _priorities = [];

exports.index = function(request, response) {
	// _prioritiesRepository.all(function(priorities) {
	// 	_priorities = priorities;
	// });
	
    _fs.readFile("public/views/root.html", function(err, content) {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(content);
        response.end();
    });
};