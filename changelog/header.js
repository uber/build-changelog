var format = require('util').format;

function ChangeLogHeader(date, version, commit) {
    if (!(this instanceof ChangeLogHeader)) {
        return new ChangeLogHeader(date, version, commit);
    }

    this.date = date;
    this.version = version;
    this.commit = commit || null;
}

ChangeLogHeader.prototype.toString = function () {
    return format('%s - %s (%s)\n',
        this.date, this.version, this.commit);
};

module.exports = ChangeLogHeader;
