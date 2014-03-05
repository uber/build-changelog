var parallel = require('continuable-para');
var path = require('path');

var transactJsonFile = require('../lib/transact-json-file.js');

function bumpMinor(opts, cb) {
    function setVersion(package) {
        package.version = opts.nextVersion;
        return package;
    }

    var packageFile = path.join(opts.folder, 'package.json');
    var shrinkwrapFile = path.join(opts.folder, 'npm-shrinkwrap.json');

    parallel([
        transactJsonFile.bind(null, packageFile, setVersion),
        transactJsonFile.bind(null, shrinkwrapFile, setVersion)
    ], cb);
}

module.exports = bumpMinor;
