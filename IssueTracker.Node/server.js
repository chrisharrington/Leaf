(function() {

    var _http = require("http");
    var _utils = require("./utils");
    var _router = require("./routing/router");

    require("./extensions/string");
    require("./controllers/welcome");

    (function() {
        _router.listen(8888);
    })();

})();