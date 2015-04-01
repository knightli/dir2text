dir2text
====


## useage

```
Usage: dir2text <path> [option]

Options:

  --help, -h
      show help

  --debug, -d
      true: open debug mode
      flase(default): close debug mode

  --skipAllFiles, -F
      true: output only include folders
      false(default): output include files (except those skipXXX files)

  --quitFirstError, -q
      true: quit program when encount error
      false(default): when encount error, pass through and go on handle next file

  --skipFileWhenReadError, -R
      true: when met an read error, skip this file node (in ouput you can not found these file)
      false(default): fill the file node with error info

  --skipFileWhenParseError, -P
      true: when met an parse error, skip this file node (in ouput you can not found these file)
      false(default): fill the file node with parse exception info

  --skipHidden, -H
      true: skip hidden files
      false(default): include hidden files

  --skipEmptyDir, -D
      true: skip empty dir
      false(default): include empty dir

  --outputJson, -j
      true: output json format string
      false(default): output struction formatted text

  --skipFileNameRegex, -x
      give an array of RegExp for exclude some file or folder
      default: ['.DS_Store','.git','.svn']

```

## install
```
npm install dir2text
```

## examples

#### default path

```
dir2text
```

default `path` is `.`

####

#### skip Hidden files/folders
```
dir2text . -H
```

or

```
dir2text . --skipHidden
```

or

```
dir2text . --skipHidden=true
```

#### skip empty folders and hidden files/folders

```
dir2text . -HD
```

#### skip file name use regex

you can transform more than one regex below:

```
dir2text . -x node_modules -x .DS_Store -x .git -x .svn -x Thumbs.db
```

> if the -x arg not exist , we will use default skip regex
> default skip regex is ['.DS_Store','.git','.svn']

## use dir2text in nodejs

```
var dir2text = require('dir2text');
var options = {
  dir: 'path/to/folder',
  skipFileNameRegex: ['.build','.DS_Store','.git']
};
dir2text(options, function (error, text) {
  if (error) {
    console.log(error);
    return;
  }
  console.log(text);
});
```

the options has all cli command options, and add `dir` param for target path.
if `dir` not supplied, use default value `.`.




