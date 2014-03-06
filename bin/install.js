var path = require('path');

var transactJsonFile = require('../lib/transact-json-file.js');
var version = require('../package.json').version;

function installModule(opts, cb) {
    var file = path.join(opts.folder, 'package.json');

    transactJsonFile(file, function (package) {
        package.scripts = package.scripts || {};

        if (!package.scripts.changelog) {
            package.scripts.changelog = 'build-changelog';
        }

        package.devDependencies = package.devDependencies || {};

        package.devDependencies['build-changelog'] =
            '~' + version;

        return package;
    }, cb);
}

module.exports = installModule;
