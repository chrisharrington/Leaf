(function() {

    exports.index = function(request, response) {
        response.write("boogity!");
        response.end();
    }

})();