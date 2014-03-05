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

build-changelog/changelog/chunk := 
    (ChangeLogHeader, Array<ChangeLogLine>) => ChangeLogChunk

build-changelog/changelog/header := (
    date: String,
    version: String,
    commit?: String
) => ChangeLogHeader

build-changelog/changelog/index := 
    (Array<ChangeLogChunk>, content: String) => ChangeLog

build-changelog/changelog/line := (
    sha: String | null,
    decorations: Array<String> | null,
    message: String
) => ChangeLogLine

build-changelog/changelog/parse := (String) => ChangeLog

build-changelog/changelog/read :=
    (fileName: String, Callback<Error, ChangeLog>)

(* ChangeLog options are passed into each tasks function. *)
type ChangelogOptions := {
    folder: String,
    nextVersion: String,
    logFlags: String,
    major: Boolean,
    patch: Boolean
}

build-changelog/tasks/bump-minor := 
    (ChangelogOptions, Callback)

build-changelog/tasks/commit-changes := 
    (ChangelogOptions, Callback)

build-changelog/tasks/update-changelog :=
    (ChangelogOptions, Callback)

build-changelog/tasks/compute-next-version :=
    (ChangelogOptions, Callback<nextVersion: String>)

build-changelog := (folder: String | {
    folder: String,
    nextVersion?: String,
    major?: Boolean,
    patch?: Boolean,
    logFlags?: String
}, cb: Callback<err: Error, nextVersion: String>)
