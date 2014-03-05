function ChangeLogHeader(date, version, commit) {
    if (!(this instanceof ChangeLogHeader)) {
        return new ChangeLogHeader(date, version, commit);
    }

    this.date = date;
    this.version = version;
    this.commit = commit || null;
}

module.exports = ChangeLogHeader;
