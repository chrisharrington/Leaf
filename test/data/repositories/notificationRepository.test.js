var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird"),
	models = require("../../../data/models");
require("../../setup");

var sut = require("../../../data/repositories/notificationRepository");

describe("notificationRepository", function() {
	describe("construction", function() {
		it("should set Notification model for base repository", function() {
			assert(sut.model == models.Notification);
		});
	});

	describe("user", function() {
		it("should call repository.get with provided user id", function() {
			var user = { _id: "the id" };
			var get = sinon.stub(sut, "get").resolves();
			return sut.user(user).then(function() {
				assert(get.calledWith({ user: user._id, isViewed: sinon.match.any }));
			});
		});

		it("should call repository.get with isViewed false", function() {
			var get = sinon.stub(sut, "get").resolves();
			return sut.user({}).then(function() {
				assert(get.calledWith({ user: sinon.match.any, isViewed: false }));
			});
		});

		it("should call repository.get with populate parameter 'issue'", function() {
			var get = sinon.stub(sut, "get").resolves();
			return sut.user({}).then(function() {
				assert(get.calledWith(sinon.match.any, "issue"));
			});
		});

		afterEach(function() {
			sut.get.restore();
		});
	});

	describe("markAsRead", function() {
		var _stubs = {};

		it("should retrieve notification using given notification id", function() {
			var notificationId = "the notification id used to retrieve the notification details";
			return _run({
				notificationId: notificationId
			}).then(function() {
				assert(_stubs.details.calledWith(notificationId));
			});
		});

		it("should set notification.isViewed to true", function() {
			var notification = { saveAsync: sinon.stub().resolves() };
			return _run({
				notification: notification
			}).then(function() {
				assert(notification.isViewed);
			});
		});

		it("should call notification.save", function() {
			return _run().then(function() {
				assert(_stubs.save.calledOnce);
			});
		});

		afterEach(function() {
			for (var name in _stubs)
				if (_stubs[name].restore)
				_stubs[name].restore();
		});

		function _run(params) {
			params = params || {};
			_stubs.details = sinon.stub(sut, "details").resolves(params.notification || { saveAsync: _stubs.save = sinon.stub().resolves() });
			return sut.markAsRead(params.notificationId || "the notification id");
		}
	});
});