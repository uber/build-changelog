# build-changelog

A CLI to auto-generate a deploy ready changelog

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
    major?: Boolean,
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

#### `options.major`

This flag defaults to `false`. When set to `true` the major
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
  the `package.json`, `npm-shrinkwrap.json`

## Installation

`npm install build-changelog`

## Tests

`npm test`

## Contributors

 - Raynos

  [docs]: https://github.com/uber/build-changelog/tree/master/docs.mli
  [thunk]: https://github.com/Raynos/continuable/blob/master/spec.md
