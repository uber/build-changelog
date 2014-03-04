var parseArgs = require('minimist');

var buildChangelog = require('../index.js');

var argv = parseArgs(process.argv.slice(2));

if (!argv.folder) {
    argv.folder = process.cwd();
}

buildChangelog(argv, function (err, nextVersion) {
    if (err) {
        throw err;
    }

    console.log('now at version %s', nextVersion);
});
