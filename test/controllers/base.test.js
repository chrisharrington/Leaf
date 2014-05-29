var sinon = require("sinon"), assert = require("assert"), Promise = require("bluebird");

exports.testRoute = function(params) {
	var func;
	var request = params.request || {}, response = { send: sinon.stub(), header: sinon.stub(), contentType: sinon.stub(), cookie: sinon.stub() };
	if (!request.getProject)
		request.getProject = function() {
			return new Promise(function(resolve) {
				resolve({ _id: params.projectId || "the project id" });
			});
		};
	request.host = params.host || "the host";
	var app = {
		get: function(route, b, c, d) {
			if (!b && !c && !d)
				return params.env;
			if (params.verb == "get" && route == params.route)
				if (d) func = d; else if (c) func = c; else func = b;
		},
		post: function(route, b, c, d) {
			if (params.verb == "post" && route == params.route)
				if (d) func = d; else if (c) func = c; else func = b;
		}
	};

	params.sut(app);
	var result = func(request, response);
	if (result)
		return result.finally(_finally);
	_finally();

	function _finally() {
		for (var name in params.stubs)
			if (params.stubs[name] && params.stubs[name].restore)
				params.stubs[name].restore();

		if (params.assert)
			params.assert({ request: request, response: response, stubs: params.stubs });
	}
};

exports.testRouteExists = function(sut, verb, route, isAnonymous) {
	var app = { get: sinon.stub(), post: sinon.stub() };
	sut(app);
	if (isAnonymous)
		assert(app[verb].calledWith(route, sinon.match.func));
	else
		assert(app[verb].calledWith(route, sinon.match.func, sinon.match.func));
};