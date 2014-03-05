var parallel = require('continuable-para');
var fs = require('fs');
var path = require('path');

function transactFile(file, lambda, cb) {
    fs.readFile(file, function (err, buf) {
        if (err) {
            return cb(err);
        }

        fs.writeFile(file, lambda(buf), cb);
    });
}

function bumpMinor(opts, cb) {
    function setVersion(buf) {
        var package = JSON.parse(String(buf));
        package.version = opts.nextVersion;
        return JSON.stringify(package, null, '  ');
    }

    var packageFile = path.join(opts.folder, 'package.json');
    var shrinkwrapFile = path.join(opts.folder, 'npm-shrinkwrap.json');

    parallel([
        transactFile.bind(null, packageFile, setVersion),
        transactFile.bind(null, shrinkwrapFile, setVersion)
    ], cb);
}

module.exports = bumpMinor;
