var path = require('path');
var test = require('tape');
var formatDate = require('date-format');

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

        function onChangelog(err, changelog) {
            assert.ifError(err);
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
        }

        function onChangeLogDiff(err, stdout) {
            assert.ifError(err);

            assert.notEqual(stdout.indexOf('new file mode'), -1);

            readChangelog(path.join(folder, 'CHANGELOG'), onChangelog);
        }

        function onLog(err, stdout) {
            assert.ifError(err);

            var lines = stdout.trim().split('\n');
            assert.equal(lines.length, 2);
            assert.notEqual(lines[0].indexOf('0.2.0'), -1);
            assert.notEqual(lines[1].indexOf('initial commit'), -1);

            exec('git diff HEAD~1 -- CHANGELOG', {
                cwd: folder
            }, onChangeLogDiff);
        }

        exec('git log --oneline', {
            cwd: folder
        }, onLog);
    });
}));
