var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird"),
	models = require("../../../data/models");
require("../../setup");

var sut = require("../../../data/repositories/userPermissionRepository");

describe("userPermissionRepository", function() {
	describe("construction", function() {
		it("should set UserPermission model for base repository", function() {
			assert(sut.model == models.UserPermission);
		});
	});

	describe("removeAllForUser", function() {
		it("should call 'removeAsync' with given user id", function() {
			var userId = "the user id", remove = sinon.stub(sut.model, "removeAsync").resolves();
			return sut.removeAllForUser(userId).then(function() {
				assert(remove.calledWith({ user: userId }));
			}).finally(function() {
				remove.restore();
			});
		});
	});

	describe("addPermissionsForUser", function() {
		it("should call 'createAsync' for each permission id given", function() {
			var permissionIds = ["first", "second", "third"], create = sinon.stub(sut.model, "createAsync").resolves();
			return sut.addPermissionsForUser("the user id", permissionIds).then(function() {
				assert(create.calledWith({ user: sinon.match.any, permission: "first" }));
				assert(create.calledWith({ user: sinon.match.any, permission: "second" }));
				assert(create.calledWith({ user: sinon.match.any, permission: "third" }));
			}).finally(function() {
				create.restore();
			});
		});

		it("should call 'createAsync' with given user id", function() {
			var userId = "the user id", create = sinon.stub(sut.model, "createAsync").resolves();
			return sut.addPermissionsForUser(userId, ["the permission id"]).then(function() {
				assert(create.calledWith({ user: userId, permission: sinon.match.any }));
			}).finally(function() {
				create.restore();
			});
		});
	});
});