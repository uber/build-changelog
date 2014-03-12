var extend = require('xtend');
var series = require('continuable-series');

var updateVersion = require('./tasks/update-version.js');
var updateChangelog = require('./tasks/update-changelog.js');
var commitChanges = require('./tasks/commit-changes.js');

var defaults = {
    major: false,
    logFlags: '--decorate --oneline',
    filename: 'CHANGELOG',
    commit: true,
    version: true,
    nextVersion: null
};

/* Invoke the following in order

 - `updateVersion()` if `opts.version` is not set to `false`
 - `updateChangelog()`
 - `commitChanges()` if `opts.commit` is not set to false
 - return `nextVersion`
*/
function main(opts, cb) {
    if (typeof opts === 'string') {
        opts = { folder: opts };
    }

    if (!opts.folder) {
        throw new Error('build-changelog: must specify `opts.folder`');
    }

    opts = extend(defaults, opts);

    function doVersionUpdate(opts, cb) {
        updateVersion(opts, function (err, nextVersion) {
            if (err) {
                return cb(err);
            }

            opts.nextVersion = opts.nextVersion || nextVersion;

            if (!opts.nextVersion) {
                return cb(new Error('must specify next version'));
            }

            cb(null);
        });
    }

    // doVersionUpdate & commitChanges are togglable tasks
    // that run by default
    var tasks = [
        opts.version !== false ?
            doVersionUpdate.bind(null, opts) : null,
        updateChangelog.bind(null, opts),
        opts.commit !== false ?
            commitChanges.bind(null, opts) : null
    ].filter(Boolean);

    series(tasks, function finish(err) {
        cb(err, err ? null : opts.nextVersion);
    });
}

module.exports = main;
