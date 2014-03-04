var path = require('path');
var extend = require('xtend');

var bumpMinor = require('./tasks/bump-minor.js');
var updateChangelog = require('./tasks/update-changelog.js');
var commitChanges = require('./tasks/commit-changes.js');

function createTasks(opts) {
    opts = extend(opts);

    opts.packageFile = path.join(opts.folder, 'package.json');
    opts.shrinkwrapFile = path.join(opts.folder, 'npm-shrinkwrap.json');
    opts.changelogFile = path.join(opts.folder, 'CHANGELOG');

    return [
        bumpMinor.bind(null, opts),
        updateChangelog.bind(null, opts),
        commitChanges.bind(null, opts)
    ];
}

module.exports = createTasks;
