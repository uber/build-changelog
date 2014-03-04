# build-changelog

A CLI to auto-generate a deploy ready changelog

## Usage

`$ build-changelog [flags]`

Running `build-changelog` will do the following steps.

 - Bump the minor version number and update the package.json
    and npm-shrinkwrap.json.
 - Generate the changelog additions. Generate a header line
    that conatins the date & version number and then find all
    the commits since the last `build-changelog` call. Add the
    header and commits to the CHANGELOG file
 - Commit the package.json, shrinkwrap and CHANGELOG changes as 
    a new version number and tags the commit as `vVERSION_NUMBER`

## Todo

 - [ ] check whether shrinkwrap.json exists
 - [ ] support different git log commands
 - [ ] support major flag
 - [ ] support tree view in changelog
 - [ ] make commit shas optional

## Example

```js
var series = require('continuable-series');
var createTasks = require('build-changelog/create-tasks.js');

var tasks = createTasks({
    nextVersion: '1.0.0',
    folder: process.cwd(),
    logFlags: '--first-parent'
})

series(tasks, function (err) {
    // completed the tasks
})
```

## Installation

`npm install build-changelog`

## Tests

`npm test`

## Contributors

 - Raynos
