(* ChangeLog types define what the changelog parser returns

    It's the structured datatype for the CHANGELOG file.
*)
type ChangeLogHeader := {
    date: String,
    version: String,
    commit?: String
}

type ChangeLogLine := {
    sha?: String,
    decorations?: Array<String>,
    message: String 
}

type ChangeLogChunk := {
    header: ChangeLogHeader
    lines: Array<ChangeLogLine>
}

type ChangeLog := {
    chunks: Array<ChangeLogChunk>,
    content: String
}

(* ChangeLog options are passed into each tasks function.

    These must be constructed as seen in create-tasks.js
*)
type ChangelogOptions := {
    folder: String,
    nextVersion: String,
    logFlags: String,
    packageFile: String,
    shrinkwrapFile: String,
    changelogFile: String
}

build-changelog/tasks/bump-minor := 
    (ChangelogOptions, Callback)

build-changelog/tasks/commit-changes := 
    (ChangelogOptions, Callback)

build-changelog/tasks/update-changelog :=
    (ChangelogOptions, Callback)

build-changelog/create-next-version :=
    (currentVersion: String, opts?: {
        major: Boolean
    }) => nextVersion: String

build-changelog/create-tasks := ({
    folder: String,
    nextVersion: String,
    logFlags: String
}) => tasks: Array<Thunk<Error>>

build-changelog/exec := (cmd: String, opts?: {
    silent: Boolean
}, Callback<Error, stdout: Buffer>)

build-changelog := (folder: String | {
    folder: String,
    major?: Boolean,
    logFlags?: String
}, cb: Callback<err: Error, nextVersion: String>)

build-changelog/parse-changelog := (content: String) => ChangeLog

build-changelog/read-changelog := 
    (filename: String, Callback<Error, ChangeLog>)
