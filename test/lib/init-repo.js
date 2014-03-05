var path = require('path');

var withFixtures = require('./with-fixtures.js');
var gitStart = require('./git-start.js');

function initRepo(dirname, fixtures, task) {
    return function (assert) {
        var _end = assert.end;

        withFixtures(dirname, fixtures, function (cb) {
            assert.end = cb;

            gitStart(path.join(dirname, 'repo'), function (err) {
                if (err) {
                    return cb(err);
                }

                task(assert);
            });
        }, function (err) {
            assert.ifError(err);
            _end.call(assert);
        });
    };
}

module.exports = initRepo;
