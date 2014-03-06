var test = require('tape');

var buildChangelog = require('../index.js');

test('buildChangelog is a function', function (assert) {
    assert.strictEqual(typeof buildChangelog, 'function');

    assert.end();
});

require('./fresh-repo.js');
require('./second-call.js');
