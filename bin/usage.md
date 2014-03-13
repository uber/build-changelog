# {cmd} [options]

Builds the CHANGELOG file and commits it to git. Either creates
  a new CHANGELOG file or appends to the top of an existing one.

Options:
    --major            bump the major version number
    --log-flags=[str]  extra flags to pass to `git log`
    --folder=[str]     sets the git repo & CHANGELOG location
    --filename=[str]   the filename we write the CHANGELOG too

 - `--major` defaults to `false`
 - `--log-flags` defaults to `--decorate --oneline`
 - `--folder` defaults to `process.cwd()`
 - `--filename` defaults to `CHANGELOG`

## `{cmd} --help`

Prints this message

## `{cmd} install`

Will write a `changelog` script to your `package.json` file.

```json
{
    "scripts": {
        "changelog": "{cmd}"
    }
}
```

Options:
    --folder    sets the folder location of the package.json file

## `{cmd} version [<newversion> | major | minor | patch]`

This is the same as `{cmd}` except allows you to set
  a specific version. `{cmd}` will by default bump
  the minor version number.

This is an alternative to `npm version`, the main addition is
  changing the CHANGELOG file.

## `{cmd} read <file>`

Reads and parses a changelog file and writes JSON to stdout
