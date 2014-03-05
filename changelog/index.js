function ChangeLog(chunks, content) {
    if (!(this instanceof ChangeLog)) {
        return new ChangeLog(chunks, content);
    }

    this.chunks = chunks;
    this.content = content;
}

module.exports = ChangeLog;
