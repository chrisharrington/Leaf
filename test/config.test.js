var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("./setup");

describe("config", function() {
	describe("call", function() {
		beforeEach(function() {
			require.cache[process.cwd() + "/config.js"] = null;
			sut = require("../config");
		});

		it("should return 'IssueTrackerApp' with 'databaseUser'", function() {
			assert.equal(sut("databaseUser"), "leaf-app");
		});

		it("should return '54.200.254.103:27017/leaf' with 'databaseLocation'", function() {
			assert.equal(sut("databaseLocation"), "54.200.254.103:27017/leaf");
		});

		it("should return 'sha512' with 'hashAlgorithm'", function() {
			assert.equal(sut("hashAlgorithm"), "sha512");
		});

		it("should return 'YYYY-MM-DD' with 'dateFormat'", function() {
			assert.equal(sut("dateFormat"), "YYYY-MM-DD");
		});

		it("should return 'YYYY-MM-DD HH:mm:ss' with 'dateTimeFormat'", function() {
			assert.equal(sut("dateTimeFormat"), "YYYY-MM-DD HH:mm:ss");
		});

		it("should return 'leafissuetracker' with 'storageName'", function() {
			assert.equal(sut("storageName"), "leafissuetracker");
		});

		it("should return 'LeafIssueTracker' with 'sendgridUsername'", function() {
			assert.equal(sut("sendgridUsername"), "LeafIssueTracker");
		});

		it("should return 'no-reply@leafissuetracker.com' with 'fromAddress'", function() {
			assert.equal(sut("fromAddress"), "no-reply@leafissuetracker.com");
		});

		it("should return 'http://www.leafissuetracker.com' with 'domain'", function() {
			assert.equal(sut("domain"), "http://www.leafissuetracker.com");
		});

		it("should return '8080' with 'serverPort' when no port env is set", function() {
			assert.equal(sut("serverPort"), "8080");
		});

		it("should not return undefined for 'buildNumber'", function() {
			var orig = process.env;
			process.env = { BUILD_NUMBER: undefined };
			assert.notEqual(sut("buildNumber"), undefined);
			process.env = orig;
		});

		it("should return build number as read from package.json", function() {
			assert.equal(sut("buildNumber"), require("../package.json").version);
		});

		it("should return undefined with no such key", function() {
			assert.equal(undefined, sut("boogity"));
		});
	});
});