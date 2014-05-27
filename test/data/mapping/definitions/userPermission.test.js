var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../../../setup");

var config = require("../../../../config");
var fs = Promise.promisifyAll(require("fs"));
var mapper = require("../../../../data/mapping/mapper");

describe("user-permission mapping", function() {
	describe("user-permission --> user-permission-view-model", function() {
		var _define;

		beforeEach(function () {
			_define = sinon.stub(mapper, "define");
			require("../../../../data/mapping/definitions/userPermission");
		});

		it("should define user-permission/user-permission-view-model map", function () {
			assert(_define.calledWith("user-permission", "user-permission-view-model", {
				userId: "user",
				permissionId: "permission"
			}));
		});

		afterEach(function() {
			_define.restore();
			require.cache[process.cwd() + "/data/mapping/definitions/userPermission.js"] = null;
		});
	});
});
