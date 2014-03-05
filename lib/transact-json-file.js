var fs = require('fs');

function transactJsonFile(file, lambda, cb) {
    fs.readFile(file, function (err, buf) {
        if (err) {
            return cb(err);
        }

        var payload = JSON.parse(String(buf));
        var content = JSON.stringify(lambda(payload), null, '  ');

        fs.writeFile(file, lambda(content), cb);
    });
}

module.exports = transactJsonFile;
