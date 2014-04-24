require("../setup");
var assert = require("assert"), sinon = require("sinon"), repositories = require("../../data/repositories")

var sut = require("../../authentication/authenticate");

describe("authenticate", function() {
	describe("default", function() {
		var users = [{ name: "the name" }];

		it("should send 401 when no such session cookie", function(done) {
			sinon.stub(repositories.User, "get").resolves([]);

			var status;
			var request = {
				cookies: {}
			};
			var response = {
				send: function(code) {
					status = code;
				}
			};

			sut(request, response).then(function() {
				assert.equal(status, 401);
				done();
			});

			repositories.User.get.restore();
		});

		it("should send error message when failing to retrieve user", function(done) {
			var status, message, error = "oh noes! an error!";
			sinon.stub(repositories.User, "get").rejects(new Error(error));

			var request = {
				cookies: { session: "the session" }
			};
			var response = {
				send: function(m, s) {
					message = m;
					status = s;
				}
			};

			sut(request, response).then(function() {
				assert.equal(status, 401);
				assert.notEqual(message.indexOf(error), -1);
				done();
			});

			repositories.User.get.restore();
		});

		it("should send 401 when no user returned", function(done) {
			var next = sinon.spy(), status;
			sinon.stub(repositories.User, "get").resolves([]);

			var request = {
				cookies: { session: "the session" }
			};
			var response = {
				send: function(s) { status = s; }
			};

			sut(request, response, next).then(function() {
				assert.equal(status, 401);
				assert.equal(next.calledOnce, false);
				done();
			});

			repositories.User.get.restore();
		});

		it("should set session cookie", function(done) {
			var next = sinon.spy(), session = "the session", expiration = "the expiration";
			sinon.stub(repositories.User, "get").resolves([{ session: session, expiration: expiration }]);

			var request = {
				cookies: { session: "the session" }
			};
			var response = {
				cookie: sinon.stub()
			};

			sut(request, response, next).then(function() {
				assert.equal(response.cookie.calledWith("session", session, { expires: expiration }), true);
				assert.equal(next.calledOnce, true);
				done();
			});

			repositories.User.get.restore();
		});

		it("should set project", function(done) {
			var next = sinon.spy(), project = "the project";
			sinon.stub(repositories.User, "get").resolves([{ project: project }]);

			var request = {
				cookies: { session: "the session" }
			};
			var response = {
				cookie: sinon.stub()
			};

			sut(request, response, next).then(function() {
				assert.equal(request.project, project);
				assert.equal(next.calledOnce, true);
				done();
			});

			repositories.User.get.restore();
		});
	});
});