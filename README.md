# build-changelog

A CLI to auto-generate a deploy ready changelog

**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [build-changelog](#build-changelog)
    - [Usage](#usage)
        - [Steps of changelog procedure](#steps-of-changelog-procedure)
    - [Example](#example)
    - [Example changelog file](#example-changelog-file)
        - [Involved example](#involved-example)
        - [Parsing a changelog file](#parsing-a-changelog-file)
    - [Docs](#docs)
        - [Type definitions](#type-definitions)
        - [`buildChangelog(options, cb<Error, String>)`](#buildchangelogoptions-cb<error-string>)
            - [`options.folder`](#optionsfolder)
            - [`options.major`](#optionsmajor)
            - [`options.logFlags`](#optionslogflags)
        - [`var tasks = createTasks(options)`](#var-tasks-=-createtasksoptions)
            - [`options.folder`](#optionsfolder-1)
            - [`options.nextVersion`](#optionsnextversion)
            - [`options.logFlags`](#optionslogflags-1)
        - [`var changelog = parseChangelog(text)`](#var-changelog-=-parsechangelogtext)
            - [`text`](#text)
    - [Installation](#installation)
    - [Tests](#tests)
    - [Contributors](#contributors)

## Usage

`$ build-changelog [flags]`

### Steps of changelog procedure

Running `build-changelog` will do the following steps.

 - Bump the minor version number and update the package.json
    and npm-shrinkwrap.json.
 - Generate the changelog additions. Generate a header line
    that conatins the date & version number and then find all
    the commits since the last `build-changelog` call. Add the
    header and commits to the CHANGELOG file
 - Commit the package.json, shrinkwrap and CHANGELOG changes as 
    a new version number and tags the commit as `vVERSION_NUMBER`

## Example

```js
var buildChangelog = require('build-changelog');

// takes any commits not written to the changelog and adds them
// reads package.json in process.cwd() to find the new version
// to set the project to.
buildChangelog(process.cwd(), function (err, nextVersion) {
    if (err) throw err;

    console.log('the new version', nextVersion);
});
```

## Example changelog file

```
2014-03-04 - 1.1.0 (f6ec3cc)
f6ec3cc (HEAD, initial-version) better documentation
e207a6e allow a string opts
0a77206 (origin/initial-version) make npm run cover work
df03ac1 test with two calls
b8b0f0f refactor test
fa1b602 added a naive cli
bd78f26 added tests
d3df8cc initial code
ca5bda1 the individual tasks
e3b8fd4 docs
8b5d269 (origin/master, master) initial


```

### Involved example

```js
var series = require('continuable-series')
var createTasks = require('build-changelog/create-tasks')

// returns an array of three tasks matching the above steps
var tasks = createTasks({
    nextVersion: '1.1.0',
    logFlags: '--first-parent',
    folder: process.cwd()
})

series(tasks, function (err) {
    if (err) throw err;

    // executed the steps
})
```

### Parsing a changelog file

```js
var path = require('path')
var readChangelog = require('build-changelog/read-changelog')

var loc = path.join(process.cwd(), 'CHANGELOG')

readChangelog(loc, function (err, changelog) {
    if (err) throw err;

    changelog.chunks.forEach(function (chunk) {
        console.log('header', chunk.header)
        console.log('commit lines', chunk.lines)
    })
})
```

## Docs

### Type definitions

See [docs.mli][docs] for type definitions

### `buildChangelog(options, cb<Error, String>)`

```ocaml
build-changelog := (folder: String | {
    folder: String,
    nextVersion?: String,
    major?: Boolean,
    patch?: Boolean,
    logFlags?: String
}, cb: Callback<err: Error, nextVersion: String>)
```

Your `cb` will get called with an `Error` if any operation fails
  and will be called with a `nextVersion` string if the steps
  have completed successfully, the `nextVersion` string will
  be whatever version is written to the `package.json` file in 
  the given `folder`

if `options` is a `"string"` then it's a shorthand for 
  `{ folder: string }`.

#### `options.folder`

This is the `folder` in which the `CHANGELOG` will be written to.
  It is assumed that the folder is also a git repository. The
  `package.json` and `npm-shrinkwrap.json` files there will also
  be edited.

#### `options.nextVersion`

When set to a valid semver string this version will be used to
  set the package.json version to. When not set a version number
  will be computed based on bumping either the minor, major or
  patch version.

#### `options.major`

This flag defaults to `false`. When set to `true` the major
  version number will be increased instead of the minor version
  number.

#### `options.patch`

This flag defaults to `false`. When set to `true` the patch
  version number will be increased instead of the minor version
  number.

#### `options.logFlags`

To customize the generation of the actual `CHANGELOG` content
  you can pass extra flags to be passed to `git log`.

By default `build-changelog` runs `git log --decorate --oneline`.
  You may want to pass optional flags, for example if you have
  a merge only git strategy you may want to pass `--first-parent`
  or if you have a squash only git strategy you may want to pass
  `--no-merges`.

### `var tasks = createTasks(options)`

```ocaml
build-changelog/create-tasks := ({
    folder: String,
    nextVersion: String,
    logFlags: String
}) => tasks: Array<Thunk<Error>>
```

`createTasks` returns a triplet of three [thunks][thunk]. Each 
  one of the thunks represents one of the three steps defined
  above.

It is the users responsibility to call each of these thunks in
  order serially to execute the build changelog procedure.

#### `options.folder`

The same `folder` as in `buildChangelog()`. This defines where
  the `package.json`, `npm-shrinkwrap.json` and `CHANGELOG` files
  will be read from and written to

#### `options.nextVersion`

You must supply a version string that's valid `semver` to 
  `createTasks()`. this will be the new version written to disk
  and written to the top of the `CHANGELOG`.

#### `options.logFlags`

Just like `buildChangelog()` you pass in custom `logFlags` to
  customize how the commit lines are pulled out of `git`.

### `var changelog = parseChangelog(text)`

```ocaml
type ChangeLog := {
    chunks: Array<{
        header: {
            date: String,
            version: String,
            commit?: String
        },
        lines: Array<{
            sha?: String,
            decorations?: Array<String>,
            message: String 
        }>
    }>,
    content: String
}

build-changelog/parse-changelog := 
    (content: String) => ChangeLog
```

`parseChangelog(text)` will return a `ChangeLog` data record
  that is the structured form of the textual `CHANGELOG` file
  content.

the `changelog` returned contains an array of chunks, each
  chunk correspond to a versioned section of the changelog. A
  chunk contains a header section, for the versioned header line
  and an array of lines for each commit message.

#### `text`

A `"string"` of text, this will most likely be taken by reading
  your `CHANGELOG` file

## Installation

`npm install build-changelog`

## Tests

`npm test`

## Contributors

 - Raynos

  [docs]: https://github.com/uber/build-changelog/tree/master/docs.mli
  [thunk]: https://github.com/Raynos/continuable/blob/master/spec.md
