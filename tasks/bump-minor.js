var parallel = require('continuable-para');
var fs = require('fs');

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
        package.version = nextVersion;
        return JSON.stringify(package, null, '  ');
    }

    var nextVersion = opts.nextVersion;
    var packageFile = opts.packageFile;
    var shrinkwrapFile = opts.shrinkwrapFile;

    parallel([
        transactFile.bind(null, packageFile, setVersion),
        transactFile.bind(null, shrinkwrapFile, setVersion)
    ], cb);
}

module.exports = bumpMinor;
