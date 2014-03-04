var series = require('continuable-series');
var path = require('path');

var createTasks = require('./create-tasks.js');
var createNextVersion = require('./create-next-version.js');

function main(opts, cb) {
    var package = path.join(opts.folder, 'package.json');
    var currentVersion = require(package).version;
    var nextVersion = createNextVersion(currentVersion, opts);

    series(createTasks({
        folder: opts.folder,
        logFlags: opts.logFlags,
        nextVersion: nextVersion
    }), function (err) {
        cb(err, nextVersion);
    });
}

module.exports = main;
