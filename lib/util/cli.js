var argv = require('optimist').argv;

var boolArgs = {
  'debug':'verbose',
  'a':'includeAllFiles',
  'er': 'excludeReadErrors',
  'ep': 'excludeParseErrors',
  'json': 'outputJson'
};

function getopt(argv) {
  var opt = {};
  for(var p in boolArgs) {
    if(p in argv) {
      opt[boolArgs[p]] = !!argv[p];
    }
  }
  return opt;
}

module.exports = {
  read : function (settings, argv) {
    var opt = getopt(argv);
    opt.dir = argv._.length > 0 ? argv._.slice(-1)[0] : ".";
    if('ex' in argv) {
      opt.excludeFileNameRegex = Array.isArray(argv.ex) ? argv.ex : [argv.ex];
    }

    console.log('opt:',opt);
    return opt;
  },
  argv : argv
};
