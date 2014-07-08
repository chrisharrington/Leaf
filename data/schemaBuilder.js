var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));
var http = require("http");
var config = require("../config");
var querystring = require("querystring");

exports.build = function(index) {
	var directory = "./schema/";
	return fs.readdirAsync(directory).then(function(schemas) {
		return Promise.all(schemas.map(function(location) {
			if (!location.endsWith(".json"))
				return;
			return fs.readFileAsync(process.cwd() + "/schema/" + location).then(function(contents) {
				contents = contents.toString();
				return _send(index, JSON.parse(contents));
			});
		}));
	});
};

function _send(index, schema) {
	var definition = {};
	definition[schema.type] = {
		properties: schema.definition
	};

	var stringified = JSON.stringify(definition);
	return _execute(stringified, {
		host: "54.200.254.103",
		port: 9200,
		path: "/" + index + "/" + schema.type + "/_mapping",
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"Content-Length": stringified.length
		}
	});
}

function _execute(content, options) {
	return new Promise(function(resolve, reject) {
		var request = http.request(options, function(response) {
			var result = "";
			response.on("data", function(chunk) {
				result += chunk.toString();
			});
			response.on("end", function() {
				if (response.statusCode != 200)
					reject(result);
			});
			if (response.statusCode == 200)
				resolve();
		});

		request.write(content);
		request.end();
	});
}