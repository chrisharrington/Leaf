var _less = require("less");
var _fs = require("fs");

exports.bundle = function(directory, minify, callback) {
    _getAllFilesIn(directory, function(files) {
        var concatenated = _concatenateAllFiles(files);
        _less.render(concatenated, function(less) {
            if (minify)
                less = _applyMinification(less);
            callback(less);
        });
    });
};

function _getAllFilesIn(directory, callback) {
//    var readFiles = _fs.readDirSync(directory);
//    for (var i = 0; i < readFiles.length; i++) {
//        var stat = _fs.statSync(files[i]);
//        if (stat && !stat.isDirectory()) {
//            files.push(readFiles[i]);
//        } else {
//            files.push.apply(files, _getAllFilesIn(files[i], files));
//        }
//    }

    _fs.readdir(directory, function(err, files) {
        var orderedFiles = [];
        for (var i = 0; i < files.length; i++)
            if (files[i][0] == "_")
                orderedFiles.push(files.splice(i, 1)[0]);
        orderedFiles.push.apply(orderedFiles, files);
        callback(orderedFiles);
    });
}

function _concatenateAllFiles(files) {

}

function _applyMinification(content) {

}