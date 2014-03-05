// initial version from dispatch
var series = require('continuable-series');
var parallel = require('continuable-para');
var semver = require('semver');
var fs = require('fs');
var path = require('path');
var childProcess = require('child_process');
var formatDate = require('date-format').asString;
var format = require('util').format;

var currentVersion = require('../package.json').version;

var packageFile = path.join(__dirname, '..', 'package.json');
var shrinkwrapFile = path.join(__dirname, '..', 'npm-shrinkwrap.json');
var changelogFile = path.join(__dirname, '..', 'CHANGELOG');

var MAJOR = Boolean(process.env.MAJOR);
var DEBUG = Boolean(process.env.DEBUG || false);

function createNextVersion(currentVersion) {
    var version = semver.parse(currentVersion);
    if (MAJOR) {
        version.major++;
        version.minor = 0;
    } else {
        version.minor++;
    }
    version.patch = 0;
    return version.format();
}

var nextVersion = createNextVersion(currentVersion);

var changelogTitles = fs.readFileSync('CHANGELOG', 'utf8')
    .split(/\n{2,}/g)
    .map(function(chunk) {return chunk.split("\n")[0];})
    .map(function(line) {return (/^(\d{4}-\d{2}-\d{2}) +- +(\d+\.\d+\.\d+) +\(([0-9a-fA-F]{6,})\)/).exec(line);})
    .filter(function(match) {return !!match;})
    .map(function(match) {
        return {
            date: match[1],
            version: match[2],
            commit: match[3]
        };
    });

function exec(cmd, opts, cb) {
    if (typeof opts === 'function') {
        cb = opts;
        opts = {};
    }

    opts = opts || {};

    childProcess.exec(cmd, {
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

function destructiveExec(cmd, opts, cb) {
    if (!DEBUG) {
        return exec(cmd, opts, cb);
    }

    if (typeof opts === 'function') {
        cb = opts;
        opts = null;
    }

    console.log('exec command %s', cmd);
    process.nextTick(cb);
}

function safeExec(cmd, cb) {
    exec(cmd, cb);
}

function writeFile(file, buf, cb) {
    if (!DEBUG) {
        return fs.writeFile(file, buf, cb);
    }

    console.log('writing %s', String(buf).substr(0, 1000) + '...');
    console.log('to file %s', file);
    process.nextTick(cb);
}

function transactFile(file, lambda, cb) {
    fs.readFile(file, function (err, buf) {
        if (err) {
            return cb(err);
        }

        writeFile(file, lambda(buf), cb);
    });
}

function setVersion(buf) {
    var package = JSON.parse(String(buf));
    package.version = nextVersion;
    return JSON.stringify(package, null, '  ');
}

/* The following tasks execute these steps:

 - Bump the minor version number, update package.json & 
    npm-shrinkwrap.json
 - Find all commits since the last `build-changelog` call
    and add them to the top of the CHANGELOG file
 - Generate a changelog header that contains the date,
    version number & commit sha and add it to the top of the
    CHANGELOG file.
 - Add these 3 changed files, commit it as the new version 
    number and tag the commit as `vVERSION_NUMBER`

*/
var tasks = [
    function bumpMinor(cb) {
        parallel([
            transactFile.bind(null, packageFile, setVersion),
            transactFile.bind(null, shrinkwrapFile, setVersion)
        ], cb);
    },
    function updateChangelog(cb) {
        var headCmd = 'git rev-parse --short HEAD';
        var logCmd = 'git log --decorate --no-merges --oneline';
        if (changelogTitles.length) {
            logCmd += ' ' + changelogTitles[0].commit + '..';
        }
        parallel({
            head: safeExec.bind(null, headCmd),
            log: safeExec.bind(null, logCmd)
        }, function (err, result) {
            if (err) {
                return cb(err);
            }
            var time = formatDate('yyyy-MM-dd', new Date());
            var head = String(result.head.split('\n')[0]);
            var title = format('%s - %s (%s)\n', time, nextVersion, head);
            transactFile(changelogFile, function (file) {
                return title + result.log + '\n\n' + file;
            }, cb);
        });
    },
    function commit(cb) {
        var commitCmd = format('git commit -m \'%s\'', nextVersion);
        var tagCmd = format('git tag v%s -am \'%s\'', nextVersion, nextVersion);
        commitCmd += ' CHANGELOG package.json npm-shrinkwrap.json';

        series([
            destructiveExec.bind(null, commitCmd, { silent: true }),
            destructiveExec.bind(null, tagCmd)
        ], cb);
    }
];

if (require.main === module) {
    series(tasks, function (err) {
        if (err) {
            throw err;
        }

        console.log('now at version %s', nextVersion);
    });
}
