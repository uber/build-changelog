var extend = require('xtend');

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

    function finish(err) {
        cb(err, err ? null : opts.nextVersion);
    }

    function doCommit(err) {
        if (err) {
            return cb(err);
        }

        if (opts.commit !== false) {
            commitChanges(opts, finish);
        } else {
            process.nextTick(finish);
        }
    }

    function doChangelog(err, nextVersion) {
        if (err) {
            return cb(err);
        }

        opts.nextVersion = opts.nextVersion || nextVersion;

        if (!opts.nextVersion) {
            return cb(new Error('must specify next version'));
        }

        updateChangelog(opts, doCommit);
    }

    if (opts.version !== false) {
        updateVersion(opts, doChangelog);
    } else {
        process.nextTick(doChangelog);
    }
}

module.exports = main;
