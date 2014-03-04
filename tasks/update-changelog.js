var parallel = require('continuable-para');
var formatDate = require('date-format');
var format = require('util').format;
var fs = require('fs');

var exec = require('../exec.js');
var readChangelog = require('../read-changelog.js');

function updateChangelog(opts, cb) {
    var logFlags = opts.logFlags;
    var folder = opts.folder;
    var nextVersion = opts.nextVersion;
    var changelogFile = opts.changelogFile;

    readChangelog(changelogFile, function (err, changelog) {
        if (err) {
            return cb(err);
        }

        var headCmd = 'git rev-parse --short HEAD';
        var logCmd = 'git log --decorate --oneline';

        if (logFlags) {
            logCmd += ' ' + logFlags;
        }

        if (changelog && changelog.chunks.length) {
            var commit = changelog.chunks[0].header.commit;
            logCmd += ' ' + commit + '..';
        }

        var content = changelog ? changelog.content : '';

        parallel({
            head: exec.bind(null, headCmd, { cwd: folder }),
            log: exec.bind(null, logCmd, { cwd: folder })
        }, function (err, result) {
            if (err) {
                return cb(err);
            }
            var time = formatDate('yyyy-MM-dd', new Date());
            var head = String(result.head.split('\n')[0]);
            var title = format('%s - %s (%s)\n', time,
                nextVersion, head);

            var newContent = title + result.log +
                '\n\n' + content;

            fs.writeFile(changelogFile, newContent, cb);
        });
    });

}

module.exports = updateChangelog;
