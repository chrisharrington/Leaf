var sinon = require("sinon"), assert = require("assert");

exports.testRoute = function(params) {
	var func;
	var request = params.request || sinon.stub(), response = { send: sinon.stub(), contentType: sinon.stub(), cookie: sinon.stub() };
	var app = {
		get: function(route, b, c) {
			if (params.verb == "get" && route == params.route)
				if (c) func = c; else func = b;
		},
		post: function(route, b, c) {
			if (params.verb == "post" && route == params.route)
				if (c) func = c; else func = b;
		}
	};

	params.sut(app);
	return func(request, response).finally(function() {
		for (var name in params.stubs)
			if (params.stubs[name].restore)
				params.stubs[name].restore();

		if (params.assert)
			params.assert({ request: request, response: response, stubs: params.stubs });
	});
};

exports.testRouteExists = function(sut, verb, route, isAnonymous) {
	var app = { get: sinon.stub(), post: sinon.stub() };
	sut(app);
	if (isAnonymous)
		assert(app[verb].calledWith(route, sinon.match.func));
	else
		assert(app[verb].calledWith(route, sinon.match.func, sinon.match.func));
};