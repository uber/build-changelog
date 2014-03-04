var isDoubleNewLine = /\n{2,}/g;
var matchHeaderLines = /^(\d{4}-\d{2}-\d{2}) +- +(\d+\.\d+\.\d+) +\(([0-9a-fA-F]{6,})\)/;
var matchLogLine = /^([a-fA-F0-9]{7,})(?:\s+\((.+?)\))?\s+(.*)$/;

function ChangeLogHeader(date, version, commit) {
    this.date = date;
    this.version = version;
    this.commit = commit || null;
}

function ChangeLogLine(sha, decorations, message) {
    this.sha = sha || null;
    this.decorations = decorations || null;
    this.message = message;
}

function ChangeLogChunk(header, lines) {
    this.header = header;
    this.lines = lines;
}

function ChangeLog(chunks, content) {
    this.chunks = chunks;
    this.content = content;
}

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

    return new ChangeLog(chunks, content);
}

module.exports = parseChangelog;
