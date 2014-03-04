var series = require('continuable-series');

var exec = require('../../exec.js');

var DEBUG = false;

function execCmd(cmd, opts) {
    if (DEBUG) {
        return function (cb) {
            exec(cmd, opts, function (err, stdout) {
                console.log('run command', cmd);
                console.log('got error', err);
                console.log('got stdout', stdout);

                cb(err, stdout);
            });
        };
    }

    return exec.bind(null, cmd, opts);
}

function gitStart(dirname, cb) {
    var commitCmd = 'git commit -m \'initial commit\'';

    series([
        execCmd('git init', { cwd: dirname }),
        execCmd('git add . --all', { cwd: dirname }),
        execCmd(commitCmd, { cwd: dirname })
    ], cb);
}

module.exports = gitStart;
