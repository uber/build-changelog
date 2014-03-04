var path = require('path');
var test = require('tape');
var formatDate = require('date-format');
var parallel = require('continuable-para');

var buildChangelog = require('../index.js');
var initRepo = require('./lib/init-repo.js');
var exec = require('../exec.js');
var readChangelog = require('../read-changelog.js');

var folder = path.join(__dirname, 'repo');

test('run build-changelog on fresh repo', initRepo(__dirname, {
    'repo': {
        'package.json': '{ "version": "0.1.0" }',
        'npm-shrinkwrap.json': '{ "version": "0.1.0" }',
        'index.js': 'module.exports = 42;'
    }
}, function (assert) {
    buildChangelog({ folder: folder }, function (err, nextVersion) {
        assert.ifError(err);
        assert.equal(nextVersion, '0.2.0');

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

            var changelog = data.changelog;
            var diff = data.diff;
            var log = data.log;

            var logLines = log.trim().split('\n');
            assert.equal(logLines.length, 2);
            assert.notEqual(logLines[0].indexOf('0.2.0'), -1);
            assert.notEqual(logLines[1].indexOf('initial commit'), -1);


            assert.notEqual(diff.indexOf('new file mode'), -1);

            assert.ok(changelog);

            var chunks = changelog.chunks;

            assert.equal(chunks.length, 1);

            var chunk = chunks[0];
            var header = chunk.header;

            assert.equal(header.date, formatDate('yyyy-MM-dd'));
            assert.equal(header.version, '0.2.0');
            assert.ok(header.commit);

            var lines = chunk.lines;
            var line = lines[0];

            assert.equal(lines.length, 1);
            assert.ok(line.sha);
            assert.deepEqual(line.decorations, ['HEAD', 'master']);
            assert.equal(line.message, 'initial commit');

            assert.end();
        });
    });
}));
