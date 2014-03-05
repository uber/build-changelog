var fs = require('fs');
var jsonParse = require('safe-json-parse');

function transactJsonFile(file, lambda, cb) {
    fs.readFile(file, 'utf8', function (err, buf) {
        if (err) {
            return cb(err);
        }

        jsonParse(buf, function (err, payload) {
            if (err) {
                return cb(err);
            }

            var content = JSON.stringify(lambda(payload), null, '  ');

            fs.writeFile(file, content, cb);
        });
    });
}

module.exports = transactJsonFile;
