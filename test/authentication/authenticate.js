require("../../inheritance");

var assert = require("assert");
var sinon = require("sinon");
var repositories = require("../../data/repositories");
var Promise = require("bluebird");
var sinonAsPromised = require("sinon-as-promised")(Promise);

var sut = require("../../authentication/authenticate");

sinon.stub.blah = function() {
	return new Promise(function(resolve) {
		resolve("boo");
	});
};

describe("authenticate.", function() {
	describe("default", function() {
		var users = [{ name: "the name" }];
//
//		xit("should send 401 when no such session cookie", function() {
//			var status;
//			var request = {
//				cookies: {}
//			};
//			var response = {
//				send: function(code) {
//					status = code;
//				}
//			};
//
//			sut(request, response);
//
//			assert.equal(status, 401);
//		});
//
//		xit("should send error message when failing to retrieve user", function(done) {
//			var error = "oh noes! an error!";
//			sinon.stub(repositories.User, "get").rejects(error);
//
//			var request = {
//				cookies: { session: "the session" }
//			};
//			var response = {
//				send: function(message, status) {
//					assert.equal(status, 401);
//					assert.notEqual(message.indexOf(error), -1);
//					done();
//				}
//			};
//
//			sut(request, response);
//
//			repositories.User.get.restore();
//		});

		it("should send 401 when no user returned", function(done) {
			var next = sinon.spy(), status;
			sinon.stub(repositories.User, "get").resolves([]);

			var request = {
				cookies: { session: "the session" }
			};
			var response = {
				send: function(s) { status = s; }
			};

			sut(request, response, next).then(function() {
				assert.equal(status, 401);
				assert.equal(next.calledOnce, true);
			}).finally(function() {
				done();
			});

			repositories.User.get.restore();
		});
	});
});