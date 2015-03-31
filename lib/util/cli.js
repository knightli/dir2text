var optimist = require('optimist');

function _wrapDesc() {
  var descs = Array.prototype.slice.call(arguments);
  return descs.map(function(desc) {
    return _handleLines(desc);
  }).join('');
}

function _handleLines(desc) {
  var indent = '\n      ';
  return indent + desc.split(' ').reduce(function(wrappedDesc, word) {
    var lastLineIdx = wrappedDesc.length - 1;
    var lastLine = wrappedDesc[lastLineIdx];

    var appendedLastLine = lastLine === '' ? word : (lastLine + ' ' + word);

    if (appendedLastLine.length > 80) {
      wrappedDesc.push(word);
    } else {
      wrappedDesc[lastLineIdx] = appendedLastLine;
    }

    return wrappedDesc;
  }, ['']).join(indent);
}


var argv = optimist
  .usage('Usage: $0 <path> [option]')
  .options({
    help: {
      alias: 'h',
      description: _wrapDesc(
        'show help'
      ),
      type: 'boolean'
    },
    debug: {
      alias: 'd',
      description: _wrapDesc(
        'true: open debug mode',
        'flase(default): close debug mode'
      ),
      type: 'boolean'
    },
    skipAllFiles: {
      alias: 'F',
      description: _wrapDesc(
        'true: output only include folders',
        'false(default): output include files (except those skipXXX files)'
      ),
      type: 'boolean'
    },
    quitFirstError: {
      alias: 'q',
      description: _wrapDesc(
        'true: quit program when encount error',
        'false(default): when encount error, pass through and go on handle next file'
      ),
      type: 'boolean'
    },
    skipFileWhenReadError: {
      alias: 'R',
      description: _wrapDesc(
        'true: when met an read error, skip this file node (in ouput you can not found these file)',
        'false(default): fill the file node with error info'
      ),
      type: 'boolean'
    },
    skipFileWhenParseError: {
      alias: 'P',
      description: _wrapDesc(
        'true: when met an parse error, skip this file node (in ouput you can not found these file)',
        'false(default): fill the file node with parse exception info'
      ),
      type: 'boolean'
    },
    skipHidden: {
      alias: 'H',
      description: _wrapDesc(
        'true: skip hidden files',
        'false(default): include hidden files'
      ),
      type: 'boolean'
    },
    skipEmptyDir: {
      alias: 'D',
      description: _wrapDesc(
        'true: skip empty dir',
        'false(default): include empty dir'
      ),
      type: 'boolean'
    },
    outputJson: {
      alias: 'j',
      description: _wrapDesc(
        'true: output json format string',
        'false(default): output struction formatted text'
      ),
      type: 'boolean'
    },
    skipFileNameRegex: {
      alias: 'x',
      description: _wrapDesc(
        'give an array of RegExp for exclude some file or folder',
        "default: ['.DS_Store','.git','.svn']"
      ),
      type: 'array'
    }
  })
  .argv;

module.exports = {
  read: function (settings, argv) {
    var opt = argv;
    opt.dir = argv._.length > 0 ? argv._.slice(-1)[0] : ".";

    if ('skipFileNameRegex' in argv) {
      opt.skipFileNameRegex = Array.isArray(argv.skipFileNameRegex) ? argv.skipFileNameRegex : [argv.skipFileNameRegex];
    }

    return opt;
  },
  argv: argv,
  help: function() {
    optimist.showHelp();
  }
};
