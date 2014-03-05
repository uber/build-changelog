# build-changelog [options]

Builds the CHANGELOG file and commits it to git. Either creates
  a new CHANGELOG file or appends to the top of an existing one.

Options:
    --major      bump the major version number instead of minor.
    --log-flags  extra flags to pass to `git log`
    --folder     sets the git repo & CHANGELOG location

## `build-changelog --help`

Prints this message

## `build-changelog install`

Will write a `changelog` script to your `package.json` file.

```json
{
    "scripts": {
        "changelog": "build-changelog"
    }
}
```

Options:
    --folder    sets the folder location of the package.json file

## `build-changelog version [<newversion> | major | minor | patch]`

This is the same as `build-changelog` except allows you to set
  a specific version. `build-changelog` will by default bump
  the minor version number.

This is an alternative to `npm version`, the main addition is
  changing the CHANGELOG file.
