var path = require('path');
var parseArgs = require('minimist');
// var ansidown = require('ansidown');
var msee = require('msee');
// var conch = require('conch');
var fs = require('fs');

var buildChangelog = require('../index.js');

function printHelp() {
    var loc = path.join(__dirname, 'usage.md');
    var content = fs.readFileSync(loc, 'utf8');
    return console.log(msee.parse(content, {
        paragraphStart: '\n'
    }));
}

function main(opts) {
    if (opts.h || opts.help) {
        return printHelp();
    }

    // var command = opts._[0];

    if (!opts.folder) {
        opts.folder = process.cwd();
    }

    if (opts['log-flags']) {
        opts.logFlags = opts['log-flags'];
    }

    buildChangelog(opts, function (err, nextVersion) {
        if (err) {
            throw err;
        }

        console.log('now at version %s', nextVersion);
    });
}

module.exports = main;

if (require.main === module) {
    main(parseArgs(process.argv.slice(2)));
}
