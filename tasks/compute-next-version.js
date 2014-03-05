var path = require('path');
var fs = require('fs');
var jsonParse = require('safe-json-parse');
var semver = require('semver');

function createNextVersion(currentVersion, opts) {
    opts = opts || {};

    var version = semver.parse(currentVersion);

    if (opts.major) {
        version.major++;
        version.minor = 0;
        version.patch = 0;
    } else if (opts.patch) {
        version.patch++;
    } else {
        version.minor++;
        version.patch = 0;
    }

    return version.format();
}

function readJson(file, cb) {
    fs.readFile(file, function (err, buf) {
        if (err) {
            return cb(err);
        }

        jsonParse(String(buf), cb);
    });
}

function computeVersion(opts, cb) {
    var package = path.join(opts.folder, 'package.json');

    readJson(package, function (err, json) {
        if (err) {
            return cb(err);
        }

        var currentVersion = json.version;
        var nextVersion = createNextVersion(
            currentVersion, opts);

        cb(null, nextVersion);
    });
}

computeVersion.createNextVersion = createNextVersion;

module.exports = computeVersion;
