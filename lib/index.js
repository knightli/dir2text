var dir2json = require('./dir2json'),
  sortFn = require('./util/alphabetasort');

var Z0 = '    ',
    Z1 = '│   ', //9474  not 124
    C0 = '└── ',
    C1 = '├── ';

function fitem(filename, isdir, islast, parent) {
  this.filename = filename;
  this.parent = parent;
  this.isdir = isdir;
  this.islast = islast;
}

fitem.prototype.getLine = function() {
  var arr = [];
  arr.push(this.filename + (this.isdir ? '/' : '') );
  arr.push(this.islast ? C0 : C1);

  var parent = this.parent;
  while(parent) {
    arr.push(parent.islast ? Z0 : Z1);
    parent = parent.parent;
  }
  return arr.reverse().join('');
};

function concatChild(arr, src, item){
  var children = dir_arrange(src, item);
  if(children.length){
    arr = arr.concat(children);
  }
  return arr;
}

function dir_arrange(json, parent){
  var dirs = [],
    files = [];

  for(var k in json) {
    if(json[k]===null) files.push(k);
    else dirs.push(k);
  }

  dirs.sort(sortFn);
  files.sort(sortFn);

  var all = dirs.concat(files);
  var result = [];

  for(var i=0,len=all.length; i<len; i++) {

    var filename = all[i];
    var src = json[filename];
    var isdir = src!==null;

    var item = new fitem(filename, isdir, i+1==len, parent);
    result.push(item);
    if(isdir){
      result = concatChild(result, src, item);
    }
  }

  return result;

}

function render(arr){
  var lines = [];
  arr.map(function(item){
    lines.push(item.getLine());
  });
  return lines.join('\n');
}

var defaults = {
  //verbose: true,
  dir: '.',
  includeAllFiles: true,
  excludeReadErrors: true,
  excludeParseErrors: true,
  //excludeHidden: true, //default: false
  excludeFileNameRegex: ['.DS_Store','.git','.svn'],
  includeEmptyDirectories: true
};

function setup(opts){
  opts = opts || {};

  for (var key in defaults) {
    if (opts[key] === undefined) {
      opts[key] = defaults[key];
    }
  }

  return opts;
}

module.exports = function(opts, callback) {
  var options = setup(opts);

  dir2json(options, function(err, dirjson) {
    if(err) callback(err);
    if(dirjson) {

      if(options.outputJson){
        return callback(null, dirjson);
      }

      var arr = dir_arrange(dirjson);
      var str = render(arr);
      callback(null, str);
    }
  });
};
