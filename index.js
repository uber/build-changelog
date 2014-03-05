var updateVersion = require('./tasks/update-version.js');
var updateChangelog = require('./tasks/update-changelog.js');
var commitChanges = require('./tasks/commit-changes.js');

function main(opts, cb) {
    if (typeof opts === 'string') {
        opts = { folder: opts };
    }

    updateVersion(opts, function (err, nextVersion) {
        if (err) {
            return cb(err);
        }

        opts.nextVersion = opts.nextVersion || nextVersion;

        updateChangelog(opts, function (err) {
            if (err) {
                return cb(err);
            }

            commitChanges(opts, function (err) {
                cb(err, err ? null : nextVersion);
            });
        });
    });
}

module.exports = main;
