var Promise = require("bluebird"),
	less = require("less"),
	fs = Promise.promisifyAll(require("fs")),
	compressor = require("clean-css");

var _env = "development";

exports.env = function(env) {
	_env = env;
};

exports.renderScripts = function(assets) {
	var files = [];
	return _buildOrderedFileList(assets.javascript(), files).then(function() {
		console.log(files.length);
	});
};

exports.renderCss = function() {
	return new Promise(function(resolve) {
		resolve("css");
	});
};

function _buildOrderedFileList(assets, files) {
	return Promise.reduce(assets, function(list, asset) {
		return fs.statAsync(asset).then(function(info) {
			if (!info.isDirectory()) {
				list.push(asset);
				return list;
			} else
				return fs.readdirAsync(asset).then(function(newAssets) {
					for (var i = 0; i < newAssets.length; i++)
						newAssets[i] = asset + "/" + newAssets[i];
					return _buildOrderedFileList(newAssets, list);
				});
		});
	}, files);
}

exports.bundleCss = function(directory, minify, callback) {
    _getAllFilesIn(directory, [".css", ".less"], function(err, files) {
	    if (err)
	        console.log("Error while bundling: " + err);
	    _concatenateAllFiles(directory, files, function(concatenated) {
	        _less.render(concatenated, function(error, css) {
		        if (error)
		            console.log("Error while performing LESS conversion: " + error);
	            if (minify)
	                css = new _compressor().minify(css);
	            callback(css);
	        });
	    });
    });
};

exports.bundleScripts = function(directory, minify, callback) {
    _getAllFilesIn(directory, [".js"], function(err, files) {
	    _concatenateAllFiles(directory, files, function(script) {
	        if (minify)
	            script = _minifyJavascript(script);
	        callback(script);
	    });
    });
};

function _getAllFilesIn(directory, extensions, done) {
	var results = [];
	_fs.readdir(directory, function(err, files) {
		if (err) done(err);

		var pending = files.length;
		for (var i = 0; i < files.length; i++) {
			(function(file) {
				_fs.stat(file, function(err, info) {
					if (info.isDirectory())
						_getAllFilesIn(file, extensions, function(err, nested) {
							if (err)
								done(err);
							else {
								results = results.concat(nested);
								if (--pending == 0)
									done(null, results);
							}
						});
					else {
						results.push(file);
						if (--pending == 0)
							done(null, results);
					}
				});
			})(directory + "/" + files[i]);
		}
	});
}

function _isValidFile(file, extensions) {
    for (var i = 0; i < extensions.length; i++)
        if (file.endsWith(extensions[i]))
            return true;
    return false;
}

function _concatenateAllFiles(directory, files, callback) {
    var concatenated = "";
    var promises = [];
    var highPriorityFiles = [];
    var lowPriorityFiles = [];

    while (files.length > 0) {
        if (files[0][0] == "_")
            highPriorityFiles.push(files.splice(0, 1)[0]);
        else
            lowPriorityFiles.push(files.splice(0, 1)[0]);
    }

    for (var i = 0; i < highPriorityFiles.length; i++)
        concatenated += _fs.readFileSync(highPriorityFiles[i]) + "\n\n\n";

    var count = lowPriorityFiles.length;
    for (var i = 0; i < lowPriorityFiles.length; i++)
        _fs.readFile(lowPriorityFiles[i], function(err, content) {
            concatenated += content + "\n\n\n";
            if (--count == 0)
                callback(concatenated);
        });
}

function _minifyJavascript(script) {
    var jsp = require("uglify-js").parser;
    var pro = require("uglify-js").uglify;

    var ast = jsp.parse(script);
    ast = pro.ast_mangle(ast);
    ast = pro.ast_squeeze(ast);
    return pro.gen_code(ast);
}