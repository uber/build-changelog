var test = require('tape');
var fs = require('fs');
var path = require('path');

var initRepo = require('./lib/init-repo.js');
var buildChangelog = require('../index.js');

var folder = path.join(__dirname, 'repo');

test('run build-changelog & verify patch', initRepo(__dirname, {
    'repo': {
        'package.json': '{ "version": "0.1.0" }',
        'index.js': 'module.exports = 42;'
    }
}, function (assert) {
    buildChangelog({ folder: folder }, function (err, nextVersion) {
        assert.ifError(err);
        assert.equal(nextVersion, '0.1.1');

        var loc = path.join(folder, 'package.json');
        fs.readFile(loc, 'utf8', function (err, str) {
            assert.ifError(err);

            var json = JSON.parse(str);

            assert.equal(json.version, '0.1.1');

            assert.end();
        });
    });
}));
