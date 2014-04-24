var assert = require("assert"),
	sinon = require("sinon"),
	Promise = require("bluebird");
require("../setup");

var azure = require("azure");
var config = require("../../config");

var sut = require("../../storage/storage");

describe("storage", function() {
	describe("set", function() {
		var _stubs;

		beforeEach(function() {
			_stubs = {};
		});

		it("should create service with credentials read from config", function() {
			var container = "the container", storageName = "the storage name", storageKey = "the storage key";
			return _run({
				storageName: storageName,
				storageKey: storageKey,
				container: container,
				createBlobResult: {
					container: container,
					blob: "the blob"
				}
			}).then(function() {
				assert(_stubs.createService.calledWith(storageName, storageKey));
			});
		});

		it("should create the given container", function() {
			var container = "the container";
			return _run({
				container: container,
				createBlobResult: {
					container: container,
					blob: "the blob"
				}
			}).then(function() {
				assert(_stubs.createContainer.calledWith(container, sinon.match.any));
			});
		});

		it("should reject when failing to create the container", function() {
			var container = "the container";
			var error;
			return _run({
				container: container,
				createContainerError: "uh oh"
			}).catch(function(e) {
				error = e;
			}).finally(function() {
				assert(error == "Error: Error creating container: uh oh");
			});
		});

		it("should reject when failing to create blob", function() {
			var container = "the container", error;
			return _run({
				container: container,
				createBlobError: "oh noes!"
			}).catch(function(e) {
				error = e;
			}).finally(function() {
				assert(error == "Error: Error while creating block blob from stream: oh noes!");
			});
		});

		it("should resolve with data from created block", function() {
			var result = {
				container: "the container",
				blob: "the blob"
			};
			return _run({
				container: "some container name",
				createBlobResult: result
			}).then(function(returned) {
				assert(returned.container == result.container);
				assert(returned.file == result.blob);
			});
		});

		it("should resolve with id, name and size as given", function() {
			var id = 12345, name = "the name", size = 54321;
			return _run({
				container: "some container name",
				createBlobResult: {},
				id: id,
				name: name,
				size: size
			}).then(function(returned) {
				assert(returned.id == id);
				assert(returned.name == name);
				assert(returned.size == size);
			});
		});

		afterEach(function() {
			for (var name in _stubs)
				if (_stubs[name].restore)
					_stubs[name].restore();
		});

		function _run(params) {
			params = params || {};
			_stubs.config = sinon.stub(config, "call");
			_stubs.config.withArgs(sinon.match.any, "storageName").returns(params.storageName);
			_stubs.config.withArgs(sinon.match.any, "storageKey").returns(params.storageKey);
			_stubs.createService = sinon.stub(azure, "createBlobService").returns({
				createContainerIfNotExists: _stubs.createContainer = sinon.stub().yields(params.createContainerError),
				createBlockBlobFromFile: _stubs.createBlob = sinon.stub().yields(params.createBlobError, params.createBlobResult)
			});

			return sut.set(params.container, params.id, params.name, params.path, params.size);
		}
	});

	describe("get", function() {
		var _stubs;

		beforeEach(function() {
			_stubs = {};
		});

		it("should create service with credentials read from config", function() {
			var container = "the container", storageName = "the storage name", storageKey = "the storage key";
			return _run({
				storageName: storageName,
				storageKey: storageKey,
				container: container
			}).then(function() {
				assert(_stubs.createService.calledWith(storageName, storageKey));
			});
		});

		it("should call create container if not exists with given container", function() {
			var container = "the container";
			return _run({
				container: container
			}).then(function() {
				assert(_stubs.createContainer.calledWith(container));
			});
		});

		it("should reject when failing to create the container", function() {
			var container = "the container";
			var error;
			return _run({
				container: container,
				createContainerError: "uh oh"
			}).catch(function(e) {
				error = e;
			}).finally(function() {
				assert(error == "Error: Error creating container: uh oh");
			});
		});

		it("should call get blob to stream with retrieved container and given name and stream", function() {
			var container = "the container", name = "the name", stream = "the stream";
			return _run({
				container: container,
				name: name,
				stream: stream
			}).then(function() {
				assert(_stubs.getBlob.calledWith(container, name, stream));
			});
		});

		it("should reject when get blob fails", function() {
			var container = "the container", error;
			return _run({
				container: container,
				getBlobError: "uh oh"
			}).catch(function(e) {
				error = e;
			}).finally(function() {
				assert(error == "Error: Error while creating block blob from stream: uh oh");
			});
		});

		afterEach(function() {
			for (var name in _stubs)
				if (_stubs[name].restore)
					_stubs[name].restore();
		});

		function _run(params) {
			params = params || {};
			_stubs.config = sinon.stub(config, "call");
			_stubs.config.withArgs(sinon.match.any, "storageName").returns(params.storageName);
			_stubs.config.withArgs(sinon.match.any, "storageKey").returns(params.storageKey);
			_stubs.createService = sinon.stub(azure, "createBlobService").returns({
				createContainerIfNotExists: _stubs.createContainer = sinon.stub().yields(params.createContainerError),
				getBlobToStream: _stubs.getBlob = sinon.stub().yields(params.getBlobError)
			});

			return sut.get(params.container, params.name, params.stream);
		}
	});
});