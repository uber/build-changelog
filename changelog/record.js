function ChangeLogRecord(chunks, content) {
    if (!(this instanceof ChangeLogRecord)) {
        return new ChangeLogRecord(chunks, content);
    }

    this.chunks = chunks;
    this.content = content;
}

module.exports = ChangeLogRecord;
