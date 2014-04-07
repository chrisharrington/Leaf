var sinon = require("sinon"), assert = require("assert");

exports.testRoute = function(params) {
	var func;
	var request = params.request || sinon.stub(), response = { send: sinon.stub(), contentType: sinon.stub() };
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
		if (params.assert)
			params.assert({ request: request, response: response, stubs: params.stubs });

		for (var name in params.stubs)
			params.stubs[name].restore();
	});
};

exports.testRouteExists = function(sut, verb, route) {
	var app = { get: sinon.stub(), post: sinon.stub() };
	sut(app);
	assert(app[verb].calledWith(route, sinon.match.func, sinon.match.func));
};