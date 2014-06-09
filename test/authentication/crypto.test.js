var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../setup");

var config = require("../../config");
var crypto = require("crypto");

var sut = require("../../authentication/crypto");

describe("crypto", function() {
	describe("hash", function() {
		var _stubs;

		it("should create hash using config hash algorithm", function() {
			var hashAlgorithm = "ha";
			_run({
				hashAlgorithm: hashAlgorithm
			});
			assert(_stubs.createHash.calledWith(hashAlgorithm));
		});

		it("should call update with the plaintext", function() {
			var plaintext = "pt";
			_run({
				plaintext: plaintext
			});
			assert(_stubs.update.update.calledWith(plaintext));
		});

		it("should call digest with 'hex'", function() {
			_run();
			assert(_stubs.digest.digest.calledWith("hex"));
		});

		it("should return result of digest", function() {
			var hash = "the hashed result";
			assert.equal(_run({
				hash: hash
			}), hash);
		});

		afterEach(function() {
			for (var name in _stubs)
				if (_stubs[name].restore)
					_stubs[name].restore();
		});

		function _run(params) {
			params = params || {};

			_stubs = {};
			_stubs.config = sinon.stub(config, "call").returns(params.hashAlgorithm || "the hash algorithm");
			_stubs.digest = { digest: sinon.stub().returns(params.hash) };
			_stubs.update = { update: sinon.stub().returns(_stubs.digest) };
			_stubs.createHash = sinon.stub(crypto, "createHash").returns(_stubs.update);

			return sut.hash(params.plaintext || "the plaintext");
		}
	});
});