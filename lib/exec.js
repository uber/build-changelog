var childProcess = require('child_process');

function exec(cmd, opts, cb) {
    if (typeof opts === 'function') {
        cb = opts;
        opts = {};
    }

    opts = opts || {};

    childProcess.exec(cmd, {
        cwd: opts.cwd,
        maxBuffer: 2000 * 1024
    }, function (err, stdout, stderr) {
        if (err) {
            return cb(err);
        }

        if (stderr && !opts.silent) {
            return cb(new Error(stderr));
        }

        cb(null, stdout);
    });
}

module.exports = exec;
