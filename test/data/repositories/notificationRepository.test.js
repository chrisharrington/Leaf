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
});