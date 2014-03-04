var test = global.it;
var assert = require('assert');

var buildChangelog = require('../index.js');

test('buildChangelog is a function', function (end) {
    assert.strictEqual(typeof buildChangelog, 'function');
    end();
});
