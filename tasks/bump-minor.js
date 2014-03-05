var parallel = require('continuable-para');
var path = require('path');

var computeVersion = require('./compute-version.js');
var transactJsonFile = require('../lib/transact-json-file.js');

function bumpMinor(opts, cb) {
    function next(err, nextVersion) {
        if (err) {
            return cb(err);
        }

        function setVersion(package) {
            package.version = nextVersion;
            return package;
        }

        var packageFile = path.join(opts.folder, 'package.json');
        var shrinkwrapFile = path.join(opts.folder, 'npm-shrinkwrap.json');

        parallel([
            transactJsonFile.bind(null, packageFile, setVersion),
            transactJsonFile.bind(null, shrinkwrapFile, setVersion)
        ], function (err) {
            cb(err, err ? null : nextVersion);
        });
    }

    if (!opts.nextVersion) {
        computeVersion(opts, next);
    } else {
        next(null, opts.nextVersion);
    }
}

module.exports = bumpMinor;
