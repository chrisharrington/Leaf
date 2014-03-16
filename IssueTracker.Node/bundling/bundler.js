var _less = require("less");
var _fs = require("fs");
var _promsie = require("node-promise");

exports.bundle = function(directory, minify, callback) {
    _getAllFilesIn(directory, function(files) {
        _concatenateAllFiles(directory, files, function(concatenated) {
            _less.render(concatenated, function(error, css) {
                if (minify)
                    css = _applyMinification(css);
                callback(css);
            });
        });
    });
};

function _getAllFilesIn(directory, callback) {
    _fs.readdir(directory, function(err, files) {
        var orderedFiles = [];
        for (var i = 0; i < files.length; i++)
            if (files[i][0] == "_")
                orderedFiles.push(files.splice(i, 1)[0]);
        orderedFiles.push.apply(orderedFiles, files);
        callback(orderedFiles);
    });
}

function _concatenateAllFiles(directory, files, callback) {
    var concatenated = "";
    var promises = [];
    var highPriorityFiles = [];
    var lowPriorityFiles = [];

    while (files.length > 0) {
        if (files[0][0] == "_")
            highPriorityFiles.push(directory + "/" + files.splice(0, 1)[0]);
        else
            lowPriorityFiles.push(directory + "/" + files.splice(0, 1)[0]);
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

function _applyMinification(content, callback) {
    callback(content);
}