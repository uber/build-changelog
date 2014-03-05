var format = require('util').format;
var series = require('continuable-series');

var exec = require('../lib/exec.js');

function commitChanges(opts, cb) {
    var nextVersion = opts.nextVersion;
    var folder = opts.folder;

    var addCmd = 'git add CHANGELOG package.json npm-shrinkwrap.json';
    var commitCmd = format('git commit -m \'%s\'', nextVersion);
    var tagCmd = format('git tag v%s -am \'%s\'', nextVersion,
        nextVersion);

    series([
        exec.bind(null, addCmd, { cwd: folder }),
        exec.bind(null, commitCmd, { silent: true, cwd: folder }),
        exec.bind(null, tagCmd, { cwd: folder })
    ], cb);
}

module.exports = commitChanges;
