function ChangeLogChunk(header, lines) {
    if (!(this instanceof ChangeLogChunk)) {
        return new ChangeLogChunk(header, lines);
    }

    this.header = header;
    this.lines = lines;
}

module.exports = ChangeLogChunk;
