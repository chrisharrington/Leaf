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
		})
	});
});