var _less = require("less");
var _fs = require("fs");
var _compressor = require("clean-css");

exports.bundleCss = function(directory, minify, callback) {
    var files = _getAllFilesIn(directory, [".css", ".less"]);
    _concatenateAllFiles(directory, files, function(concatenated) {
        _less.render(concatenated, function(error, css) {
            if (minify)
                css = new _compressor().minify(css);
            callback(css);
        });
    });
};

exports.bundleScripts = function(directory, minify, callback) {
    var files = _getAllFilesIn(directory, [".js"]);
    _concatenateAllFiles(directory, files, function(script) {
        if (minify)
            script = _minifyJavascript(script);
        callback(script);
    });
};

function _getAllFilesIn(directory, extensions) {
    var files = _fs.readdirSync(directory);
    var orderedFiles = [];
    for (var i = 0; i < files.length; i++)
        if (_isValidFile(files[i], extensions) && files[i][0] == "_")
            orderedFiles.push(directory + "/" + files.splice(i, 1)[0]);
    for (var i = 0; i < files.length; i++) {
        var file = directory + "/" + files[i];
        if(_isValidFile(file, extensions))
            orderedFiles.push(file);
        else {
            if (_fs.statSync(file).isDirectory()) {
                var newFiles = _getAllFilesIn(file, extensions);
                for (var j = 0; j < newFiles.length; j++)
                    orderedFiles.push(newFiles[j]);
            }
        }
    }
    return orderedFiles;
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