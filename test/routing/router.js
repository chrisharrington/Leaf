var assert = require("assert");
var router = require("./../../routing/router");

require("./../../extensions/string");

describe("routing/router", function() {
    before(function() {
        router.listen(8080);
    });

    describe("handle", function() {
        it("should return a 404 with no such controller", function() {
            var written, status, end = false;
            var request = { method: "get", url: "nope" };
            var response = {
                writeHead: function(s) { status = s; },
                write: function(w) { written = w; },
                end: function() { end = true; }
            };
            router.handle(request, response);

            assert(status == 404);
            assert(written == "No route for " + request.url + " was found.");
            assert(end);
        });

        it("should return a 404 with no such action", function() {
            var written, status, end = false;
            var request = { method: "get", url: "welcome/nope" };
            var response = {
                writeHead: function(s) { status = s; },
                write: function(w) { written = w; },
                end: function() { end = true; }
            };
            router.controllers = {
                welcome: {
                    blah: function () { methodCalled = true; }
                }
            };
            router.handle(request, response);

            assert(status == 404);
            assert(written == "No route for " + request.url + " was found.");
            assert(end);
        });

        it("should call index method when no action found", function() {
            var request = { method: "get", url: "/welcome" };
            var indexCalled = false;

            var orig = router.controllers;
            router.controllers = {
                welcome: {
                    index: function () { indexCalled = true; }
                }
            };
            router.handle(request);

            assert(indexCalled);

            router.controllers = orig;
        });

        it("should call specified action on specified controller", function() {
            var request = { method: "get", url: "/welcome/blah" };
            var methodCalled = false;

            var orig = router.controllers;
            router.controllers = {
                welcome: {
                    blah: function () { methodCalled = true; }
                }
            };
            router.handle(request);

            assert(methodCalled);
            router.controllers = orig;
        });
    });

    after(function() {
        router.close();
    });
});