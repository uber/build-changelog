var fs = require('fs');
var path = require('path');
var format = require('util').format;
var series = require('continuable-series');

var exec = require('../lib/exec.js');

function commitChanges(opts, cb) {
    var nextVersion = opts.nextVersion;
    var folder = opts.folder;

    function onStat(err, stat) {
        var shrinkwrap = stat ? 'npm-shrinkwrap.json' : '';

        var addCmd = format(
            'git add %s package.json %s',
            opts.filename,
            shrinkwrap
        );
        var commitCmd = format('git commit -m \'%s\'', nextVersion);
        var tagCmd = format('git tag v%s -am \'%s\'', nextVersion,
            nextVersion);

        series([
            exec.bind(null, addCmd, { cwd: folder }),
            exec.bind(null, commitCmd, { silent: true, cwd: folder }),
            exec.bind(null, tagCmd, { cwd: folder })
        ], cb);
    }

    fs.stat(path.join(folder, 'npm-shrinkwrap.json'), onStat);
}

module.exports = commitChanges;
