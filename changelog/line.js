function ChangeLogLine(sha, decorations, message) {
    if (!(this instanceof ChangeLogLine)) {
        return new ChangeLogLine(sha, decorations, message);
    }

    this.sha = sha || null;
    this.decorations = decorations || null;
    this.message = message;
}

module.exports = ChangeLogLine;
