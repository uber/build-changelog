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

function gitStart(dirname, opts, cb) {
    if (typeof opts === 'function') {
        cb = opts;
        opts = {};
    }

    var message = opts.message || 'initial commit';
    var commitCmd = 'git commit -m \'' + message + '\'';

    series([
        !opts.exists ? execCmd('git init', { cwd: dirname }) : null,
        execCmd('git add . --all', { cwd: dirname }),
        execCmd(commitCmd, { cwd: dirname })
    ].filter(Boolean), cb);
}

module.exports = gitStart;
