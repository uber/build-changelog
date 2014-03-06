var test = require('tape');
var path = require('path');
var series = require('continuable-series');
var parallel = require('continuable-para');
var fs = require('fs');

var exec = require('../lib/exec.js');
var readChangelog = require('../changelog/read.js');
var buildChangelog = require('../index.js');
var initRepo = require('./lib/init-repo.js');
var gitStart = require('./lib/git-start.js');

var folder = path.join(__dirname, 'repo');

function setupRepo(dirname, fixtures, task) {
    return initRepo(dirname, fixtures, function (assert) {
        series([
            buildChangelog.bind(null, { folder: folder }),
            fs.writeFile.bind(null, path.join(folder, 'index.js'),
                'module.exports = 43;'),
            gitStart.bind(null, folder, {
                exists: true,
                message: 'an extra commit'
            })
        ], function (err) {
            if (err) {
                // non-standard usage of assert.end()
                return assert.end(err);
            }

            task(assert);
        });
    });
}

test('run build-changelog twice', setupRepo(__dirname, {
    'repo': {
        'package.json': '{ "version": "0.1.0" }',
        'npm-shrinkwrap.json': '{ "version": "0.1.0" }',
        'index.js': 'module.exports = 42;'
    }
}, function (assert) {
    buildChangelog({ folder: folder }, function (err, nextVersion) {
        assert.ifError(err);
        assert.equal(nextVersion, '0.3.0');

        parallel({
            log: exec.bind(null, 'git log --oneline', {
                cwd: folder
            }),
            diff: exec.bind(null, 'git diff HEAD~1 -- CHANGELOG', {
                cwd: folder
            }),
            changelog: readChangelog.bind(null, path.join(folder, 'CHANGELOG'))
        }, function (err, data) {
            assert.ifError(err);

            var logLines = data.log.trim().split('\n');
            assert.equal(logLines.length, 4);
            assert.notEqual(logLines[0].indexOf('0.3.0'), -1);
            assert.notEqual(logLines[1].indexOf('an extra commit'), -1);
            assert.notEqual(logLines[2].indexOf('0.2.0'), -1);
            assert.notEqual(logLines[3].indexOf('initial commit'), -1);

            var diff = data.diff;

            assert.equal(diff.indexOf('new file mode'), -1);
            assert.notEqual(diff.indexOf('@@ -1,3 +1,8 @@'), -1);

            var changelog = data.changelog;

            assert.equal(changelog.chunks.length, 2);

            var chunk1 = changelog.chunks[0];
            var chunk2 = changelog.chunks[1];

            assert.equal(chunk2.header.version, '0.2.0');
            assert.equal(chunk1.header.version, '0.3.0');

            var lines1 = chunk1.lines;
            var lines2 = chunk2.lines;

            assert.equal(lines2.length, 1);
            assert.equal(lines2[0].message, 'initial commit');
            assert.deepEqual(lines2[0].decorations,
                ['HEAD', 'master']);

            assert.equal(lines1.length, 2);
            assert.equal(lines1[0].message, 'an extra commit');
            assert.deepEqual(lines1[0].decorations,
                ['HEAD', 'master']);
            assert.equal(lines1[1].message, '0.2.0');
            assert.deepEqual(lines1[1].decorations,
                ['tag: v0.2.0']);

            assert.end();
        });
    });
}));
