var bumpMinor = require('./tasks/bump-minor.js');
var updateChangelog = require('./tasks/update-changelog.js');
var commitChanges = require('./tasks/commit-changes.js');
var computeVersion = require('./tasks/compute-next-version.js');

function main(opts, cb) {
    if (typeof opts === 'string') {
        opts = { folder: opts };
    }

    function next(err, nextVersion) {
        if (err) {
            return cb(err);
        }

        opts.nextVersion = nextVersion;

        bumpMinor(opts, function (err) {
            if (err) {
                return cb(err);
            }

            updateChangelog(opts, function (err) {
                if (err) {
                    return cb(err);
                }

                commitChanges(opts, function (err) {
                    cb(err, nextVersion);
                });
            });
        });
    }

    if (!opts.nextVersion) {
        computeVersion(opts, next);
    } else {
        next(null, opts.nextVersion);
    }
}

module.exports = main;
