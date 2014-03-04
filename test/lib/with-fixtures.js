var fs = require('fs');
var path = require('path');
var parallel = require('continuable-para');
var series = require('continuable-series');
var rimraf = require('rimraf');

function createFixtures(dirname, fixtures, callback) {
    var tasks = Object.keys(fixtures).map(function (key) {
        var value = fixtures[key];
        var loc = path.join(dirname, key);

        if (typeof value === 'string') {
            return fs.writeFile.bind(null, loc, value);
        } else if (typeof value === 'object') {
            return series([
                fs.mkdir.bind(null, loc),
                createFixtures.bind(null, loc, value)
            ]);
        }
    });

    parallel(tasks, callback);
}

function teardownFixtures(dirname, fixtures, callback) {
    var tasks = Object.keys(fixtures).map(function (key) {
        var value = fixtures[key];
        var loc = path.join(dirname, key);

        if (typeof value === 'string') {
            return fs.unlink.bind(null, loc);
        } else if (typeof value === 'object') {
            return series([
                teardownFixtures.bind(null, loc, value),
                rimraf.bind(null, loc)
            ]);
        }
    });

    parallel(tasks, callback);
}

/* withFixtures takes a hash of file fixtures and a task to
    execute.

    It then ensures the fixtures exists in the file system,
        runs the task and then removes the fixtures.

    When it's done with the task it will call the callback.

    ```js
    var test = require('mocha').test;
    var assert = require('assert');
    var configChain = require('config-chain');

    test('run some test', withFixtures(__dirname, {
        json: {
            'config.json': '{ "port": 3000, "awesome": true }',
            'test.json': '{ "port": 4000 }'
        }
    }, function (end) {
        var config = configChain(
            './json/' + process.env.NODE_ENV + '.json',
            './json/config.json'
        );

        assert.equal(config.port, 4000);
        assert.equal(config.awesome, true);

        end();
    }));
    ```

    `withFixtures` is very useful to use with writing integration
        tests. It allows you to declare a file system as a simple
        object and then run a test case against it knowing that
        it will be cleaned up after the test case finishes.

    Notice the usage of the `__dirname` to tell `withFixtures`
        where the folders are local to. In this case the dirname
        of the test file, but it can be set to `process.cwd()` or
        `os.tmpDir()` or whatever location you want.

*/

function withFixtures(dirname, fixtures, task, callback) {
    if (!callback) {
        return withFixtures.bind(null, dirname, fixtures, task);
    }

    createFixtures(dirname, fixtures, function onFixtures(err) {
        if (err) {
            return callback(err);
        }

        task(function onTask(err) {
            function onTeardown(newErr) {
                callback(err || newErr);
            }

            teardownFixtures(dirname, fixtures, onTeardown);
        });
    });
}

module.exports = withFixtures;
