var path = require('path');
var template = require('string-template');

var version = require('../package.json').version;
var transactJsonFile = require('../lib/transact-json-file.js');

var majorCommand = '{cmd} --major';
var minorCommand = '{cmd} --minor';
var patchCommand = '{cmd} --patch';
var deprecatedCommand = 'echo DEPRECATED: please run either ' +
    'of the changelog-patch or changelog-minor scripts; exit 1';

function installModule(opts, cb) {
    var file = path.join(opts.folder, 'package.json');

    opts.cmd = opts.cmd || 'build-changelog';
    opts.packageVersion = opts.packageVersion || '^' + version;
    opts.moduleName = opts.moduleName || 'build-changelog';

    transactJsonFile(file, function (package) {
        package.scripts = package.scripts || {};

        package.scripts['changelog-major'] =
            template(majorCommand, opts);
        package.scripts['changelog-minor'] =
            template(minorCommand, opts);
        package.scripts['changelog-patch'] =
            template(patchCommand, opts);

        if (package.scripts.changelog) {
            package.scripts.changelog = deprecatedCommand;
        }

        if (!opts.onlyScripts) {
            package.devDependencies = package.devDependencies || {};
            package.devDependencies[opts.moduleName] =
                opts.packageVersion;
        }

        return package;
    }, cb);
}

module.exports = installModule;
