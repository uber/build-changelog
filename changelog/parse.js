var isDoubleNewLine = /\n{2,}/g;
var matchHeaderLines = /^(\d{4}-\d{2}-\d{2}) +- +(\d+\.\d+\.\d+) +\(([0-9a-fA-F]{6,})\)/;
var matchLogLine = /^([a-fA-F0-9]{7,})(?:\s+\((.+?)\))?\s+(.*)$/;

var ChangeLogHeader = require('./header.js');
var ChangeLogRecord = require('./record.js');
var ChangeLogLine = require('./line.js');
var ChangeLogChunk = require('./chunk.js');

function parseLogLine(logLine) {
    var match = matchLogLine.exec(logLine);

    if (!match) {
        return null;
    }

    var decorations = match[2].split(',').map(function (s) {
        return s.trim();
    });

    return new ChangeLogLine(match[1], decorations, match[3]);
}

function parseHeaderLine(headerLine) {
    var match = matchHeaderLines.exec(headerLine);

    if (!match) {
        return null;
    }

    return new ChangeLogHeader(match[1], match[2], match[3]);
}


function parseChangelog(content) {
    if (!content) {
        return null;
    }

    var parts = content.split(isDoubleNewLine);

    var chunks = parts.filter(function (chunk) {
        return Boolean(chunk.trim());
    }).map(function (chunk) {
        var lines = chunk.split('\n');
        var headerLine = lines[0];

        var logLines = lines.slice(1);

        return new ChangeLogChunk(
            parseHeaderLine(headerLine),
            logLines.map(parseLogLine)
        );
    });

    return new ChangeLogRecord(chunks, content);
}

module.exports = parseChangelog;
