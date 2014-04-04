require("../setup");
var should = require("should"), assert = require("assert"), sinon = require("sinon"), repositories = require("../../data/repositories"), Promise = require("bluebird")
var fs = Promise.promisifyAll(require("fs"));
var mustache = require("mustache");

var sut = require("../../controllers/base");

describe("base", function() {
	describe("inject", function() {
		it("should read content on first call", function() {
			return _run({
				assert: function() {
					assert(fs.readFileAsync.calledOnce);
				}
			});
		});

		function _run(params) {
			if (!params.html)
				params.html = "the html";
			if (!params.content)
				params.content = "the content";

			sinon.stub(fs, "readFileAsync").resolves(params.content);

			return sut.inject(params.html).then(function() {
				params.assert();
			}).finally(function() {
				fs.readFileAsync.restore();
			});
		}
	});
});