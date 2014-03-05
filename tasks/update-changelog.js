var parallel = require('continuable-para');
var formatDate = require('date-format');
var fs = require('fs');
var path = require('path');

var exec = require('../lib/exec.js');
var readChangelog = require('../changelog/read.js');
var ChangeLogHeader = require('../changelog/header.js');

function createCommands(changelog, opts) {
    var headCmd = 'git rev-parse --short HEAD';
    var logCmd = 'git log --decorate --oneline';

    if (opts.logFlags) {
        logCmd += ' ' + opts.logFlags;
    }

    if (changelog && changelog.chunks.length) {
        var commit = changelog.chunks[0].header.commit;
        logCmd += ' ' + commit + '..';
    }

    return {
        head: exec.bind(null, headCmd, { cwd: opts.folder }),
        log: exec.bind(null, logCmd, { cwd: opts.folder })
    };
}

function updateChangelog(opts, cb) {
    var nextVersion = opts.nextVersion;
    var changelogFile = path.join(opts.folder, 'CHANGELOG');

    readChangelog(changelogFile, function (err, changelog) {
        if (err) {
            return cb(err);
        }

        var commands = createCommands(changelog, opts);

        parallel(commands, function (err, result) {
            if (err) {
                return cb(err);
            }

            var header = new ChangeLogHeader(
                formatDate('yyyy-MM-dd'),
                nextVersion,
                result.head.split('\n')[0]
            );
            var content = changelog ? changelog.content : '';
            var newContent = header.toString() + result.log +
                '\n\n' + content;

            fs.writeFile(changelogFile, newContent, cb);
        });
    });

}

module.exports = updateChangelog;
