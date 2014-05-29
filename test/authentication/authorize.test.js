require("../setup");
var assert = require("assert"), sinon = require("sinon"), repositories = require("../../data/repositories")

var sut = require("../../authentication/authorize");

describe("authorize", function() {
	var _stubs;

	describe("default", function () {
		it("should return a function", function() {
			assert(typeof(sut("the permission")) == "function");
		});

		it("should retrieve permission according to tag", function() {
			var permission = "the permission";
			return _run({
				permission: permission
			}).then(function() {
				assert(_stubs.permission.calledWith({ tag: permission }));
			});
		});

		it("should retrieve user permission using user read from request", function() {
			var userId = "the user id read from request";
			return _run({
				userId: userId
			}).then(function() {
				assert(_stubs.userPermission.calledWith({ user: userId, permission: sinon.match.any }));
			});
		});

		it("should call 'next' if user permission found", function() {
			var next = sinon.stub();
			return _run({
				oneUserPermission: "the found user permission",
				next: next
			}).then(function() {
				assert(next.calledOnce);
			});
		});

		it("should call send with 401 when no user permission found", function() {
			var send = sinon.stub();
			return _run({
				response: { send: send }
			}).then(function() {
				assert(send.calledWith(401));
			});
		});

		afterEach(function() {
			for (var name in _stubs)
				if (_stubs[name].restore)
					_stubs[name].restore();
		});
	});

	function _run(params) {
		params = params || {};
		_stubs = {};
		_stubs.permission = sinon.stub(repositories.Permission, "one").resolves(params.onePermission || { _id: "the permission id" });
		_stubs.userPermission = sinon.stub(repositories.UserPermission, "one").resolves(params.oneUserPermission);

		return sut(params.permission)({
			user: {
				_id: params.userId || "the user id"
			}
		}, params.response || { send: sinon.stub() }, params.next);
	}
});