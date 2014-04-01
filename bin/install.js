var path = require('path');

var version = require('../package.json').version;
var transactJsonFile = require('../lib/transact-json-file.js');

var minorCommand = 'build-changelog --minor';
var patchCommand = 'build-changelog --patch';
var deprecatedCommand = 'echo DEPRECATED: please run either ' +
    'of the changelog-patch or changelog-minor scripts; exit 1';

function installModule(opts, cb) {
    var file = path.join(opts.folder, 'package.json');

    transactJsonFile(file, function (package) {
        package.scripts = package.scripts || {};

        if (!package.scripts['changelog-minor']) {
            package.scripts['changelog-minor'] = minorCommand;
        }

        if (!package.scripts['changelog-patch']) {
            package.scripts['changelog-patch'] = patchCommand;
        }

        if (package.scripts.changelog) {
            package.scripts.changelog = deprecatedCommand;
        }

        if (!opts.onlyScripts) {
            package.devDependencies = package.devDependencies || {};
            package.devDependencies['build-changelog'] =
                '^' + version;
        }

        return package;
    }, cb);
}

module.exports = installModule;
