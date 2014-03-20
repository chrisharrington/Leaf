require("./extensions/string");

var _express = require("express");
var _app = _express();

require("./controllers/bundle")(_app);
require("./controllers/root")(_app);

_app.use(_express.static(__dirname + '/public'));

var _port = 8888;
_app.listen(_port, function() { console.log("Server listening on port %d.", _port); });