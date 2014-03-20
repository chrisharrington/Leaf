module.exports = function(app) {
	var _bundler = require("./../bundling/bundler");

	app.get("/bundle/style", function(request, response) {
		_bundler.bundleCss("./public/css", false, function(css) {
			response.writeHead(200, { "Content-Type": "text/css" });
			response.write(css);
			response.end();
		});
	});

	app.get("/bundle/scripts", function(request, response) {
		_bundler.bundleScripts("./public/scripts", false, function(script) {
			response.writeHead(200, { "Content-Type": "text/javascript" });
			response.write(script);
			response.end();
		});
	});
};