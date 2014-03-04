var semver = require('semver');

function createNextVersion(currentVersion, opts) {
    opts = opts || {};
    var version = semver.parse(currentVersion);
    if (opts.major) {
        version.major++;
        version.minor = 0;
    } else {
        version.minor++;
    }
    version.patch = 0;
    return version.format();
}

module.exports = createNextVersion;
