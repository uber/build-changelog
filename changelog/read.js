var fs = require('fs');

var parseChangeLog = require('./parse.js');

function readChangelog(file, cb) {
    fs.readFile(file, 'utf8', function (err, content) {
        if (err && err.code === 'ENOENT') {
            return cb(null, null);
        }

        if (err) {
            return cb(err);
        }

        cb(null, parseChangeLog(content));
    });
}

module.exports = readChangelog;
