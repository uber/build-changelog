var series = require('continuable-series');
var path = require('path');
var fs = require('fs');
var jsonParse = require('safe-json-parse');

var createTasks = require('./create-tasks.js');
var createNextVersion = require('./create-next-version.js');

function readJson(file, cb) {
    fs.readFile(file, function (err, buf) {
        if (err) {
            return cb(err);
        }

        jsonParse(String(buf), cb);
    });
}

function main(opts, cb) {
    if (typeof opts === 'string') {
        opts = { folder: opts };
    }

    var package = path.join(opts.folder, 'package.json');

    readJson(package, function (err, json) {
        if (err) {
            return cb(err);
        }

        var currentVersion = json.version;
        var nextVersion = createNextVersion(
            currentVersion, opts);

        series(createTasks({
            folder: opts.folder,
            logFlags: opts.logFlags,
            nextVersion: nextVersion
        }), function (err) {
            cb(err, nextVersion);
        });
    });
}

module.exports = main;
