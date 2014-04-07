require("../setup");
var should = require("should"), assert = require("assert"), sinon = require("sinon"), Promise = require("bluebird"), extend = require('node.extend');
var base = require("./base");
var repositories = require("../../data/repositories");
var mapper = require("../../data/mapper");

var sut = require("../../controllers/notifications");

describe("notifications", function() {
	describe("get /notifications", function() {
		it("should set get /issues route", function() {
			base.testRouteExists(sut, "get", "/notifications");
		});

		it("should send 200", function() {
			return _testRoute({
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.any, 200));
				}
			});
		});

		it("should send 500 when failing to retrieve user notifications", function() {
			return _testRoute({
				notificationUser: sinon.stub(repositories.Notification, "user").rejects(),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		it("should send 500 when failing to map notifications", function() {
			return _testRoute({
				mapperMapAll: sinon.stub(mapper, "mapAll").rejects(),
				assert: function(result) {
					assert(result.response.send.calledWith(sinon.match.string, 500));
				}
			});
		});

		function _testRoute(params) {
			return base.testRoute(extend(params, {
				stubs: {
					notificationUser: params.notificationUser || sinon.stub(repositories.Notification, "user").resolves(params.notificationUserResult || {}),
					mapperMapAll: params.mapperMapAll || sinon.stub(mapper, "mapAll").resolves(params.mapperMapAllResult || {})
				},
				sut: sut,
				verb: "get",
				route: "/notifications"
			}));
		}
	});
});