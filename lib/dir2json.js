var async = require("async"),
fs = require("fs"),
path = require("path"),
hidefile = require("hidefile");

function merge (memo, key, src, callback) {
  if (memo[key]) {
    var dest = memo[key];
    async.each(Object.keys(src),
      function (item, cb) {
        if (dest[key]) {
          cb(key);
        } else {
          memo[key][item] = src[item];
        }
      },
      function (error) {
        callback(error, memo);
      });
    callback(null, memo);
  } else {
    memo[key] = src;
    callback(null, memo);
  }
}

var my = function (configuration) {
  this.configuration = configuration;
};

my.prototype = {
  debug: function (message) {
    if (this.configuration.debug) {
      console.log(message);
    }
  },
  readdir: function (callback, dir) {
    dir = dir || this.configuration.dir;
    this.debug(dir);
    fs.readdir(dir, this.parseFiles.bind(this, callback, dir));
  },
  parseFiles: function (callback, dir, error, files) {
    if (error) {
      callback(error);
      return;
    }
    async.reduce(files,{},this.parseFile.bind(this, dir),callback);
  },
  parseFile: function (dir, memo, file, callback) {
    fs.stat(path.join(dir, file), this.parseFileStat.bind(this, dir, memo, file, callback));
  },
  isInclude: function(dir, file, callback) {
    if (!this.includes(file)) {
      return callback(false);
    }

    if (!this.configuration.skipHidden) {
      return callback(true);
    }

    hidefile.isHidden(path.join(dir, file), function(isHidden) {
      if (isHidden) {
        return callback(false);
      }
      callback(true);
    });
  },
  parseFileStat: function (dir, memo, file, callback, error, stat) {
    if (error) {
      callback(error);
    } else if (stat.isFile()) {
      if (this.configuration.skipAllFiles) {
        callback(null, memo);
      } else {
        this.isInclude(dir, file, function(include) {
          if (include) {
            memo[file] = null;
          }
          callback(null, memo);
        }.bind(this));
      }
    } else {

      this.isInclude(dir, file, function(include) {
        if (include) {
          this.readdir(this.dirread.bind(this, memo, file, callback), path.join(dir, file));
        } else {
          callback(null, memo);
        }
      }.bind(this));

    }
  },
  includes: function (fileName) {
    return (!this.configuration.skipFileNameRegex || !this.configuration.skipFileNameRegex.some(function (element) {
      return (new RegExp(element, "i")).test(fileName);
    }));
  },
  parseData: function (memo, file, callback, error, data) {
    if (error) {
      if (!this.configuration.skipFileWhenReadError) {
        memo[file] = error;
      }
      if (this.configuration.quitFirstError) {
        callback(error, memo);
      } else {
        callback(null, memo);
      }
    } else {
      try {
        merge(memo, file, JSON.parse(data), callback);
      } catch (exception) {
        if (!this.configuration.skipFileWhenParseError) {
          memo[file] = exception;
        }
        if (this.configuration.quitFirstError) {
          callback(error, memo);
        } else {
          callback(null, memo);
        }
      }
    }
  },
  dirread: function (memo, file, callback, error, obj) {
    if (obj && Object.keys(obj).length > 0 || !this.configuration.skipEmptyDir) {
      merge(memo, file, obj, callback);
    } else {
      callback(null, memo);
    }
  }

};

function dir2json(configuration, callback) {
  var that = new my(configuration);
  return that.readdir(callback);
}

module.exports = dir2json;
