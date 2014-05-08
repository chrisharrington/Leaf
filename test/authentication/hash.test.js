var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../setup");

var base = require("../base");
var config = require("../../config");
var crypto = require("crypto");

var sut = require("../../authentication/hash");

describe("hash", function() {
	describe("call", function() {
		var _stubs;

		it("should create hash", function() {
			_run();

			assert(_stubs.createHash.calledOnce);
		});

		it("should get hash algorithm from config", function() {
			_run();

			assert(_stubs.config.calledWith(sinon.match.any, "hashAlgorithm"));
		});

		it("should create hash using hash algorithm from config", function() {
			var algorithm = "the hash algorithm";

			_run({
				hashAlgorithm: algorithm
			});

			assert(_stubs.createHash.calledWith(algorithm));
		});

		it("should update hash with given text", function() {
			var text = "the text to update";

			_run({
				text: text
			});

			assert(_stubs.update.calledWith(text));
		});

		it("should call digest with 'hex'", function() {
			_run();

			assert(_stubs.digest.calledWith("hex"));
		});

		it("should return result of digest", function() {
			var result = "the hash result";

			assert.equal(_run({ result: result }), result);
		});

		afterEach(function() {
			base.restoreStubs(_stubs);
		});

		function _run(params) {
			params = params || {};

			_stubs = {};
			_stubs.createHash = sinon.stub(crypto, "createHash").returns({ update: _stubs.update = sinon.stub().returns({ digest: _stubs.digest = sinon.stub().returns(params.result || "the hash result") }) });
			_stubs.config = sinon.stub(config, "call").returns(params.hashAlgorithm);

			return sut(params.text || "the plaintext");
		}
	});
});
