//jest.dontMock('../dir2json');
jest.autoMockOff();

var dir2text = require('../index'),
  fs = require('fs'),
  rootDir = './',
  testDir = rootDir + 'test/';

describe('dir2text test', function() {

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

  function mixin(obj1, obj2){
    var o = JSON.parse(JSON.stringify(obj1));
    for (var p in obj2) {
      o[p] = obj2[p];
    }
    return o;
  }

  function getRegularCases(){
    var cases = [];
    for (var i = 1; i < 8; i++) {
      cases.push({
        index: i,
        opt: mixin(defaults, {dir:testDir+'dirs/test'+i}),
        expectText: fs.readFileSync(testDir+'expect/test'+i+'.txt','utf-8').trim()
      });
    }
    return cases;
  }

  var cases = getRegularCases();
  var left = cases.length;

  function makeTestFn(item) {

    return function() {

      var rst_dirtext,rst_err, flag;

      it("check text for test"+item.index, function() {

        runs(function() {
          flag = false;
          value = void(0);
          dir2text(item.opt, function(err, dirtext) {
            rst_err = err;
            rst_dirtext = dirtext;
            flag = true;
          });
        });

        waitsFor(function() {
          return flag;
        }, "The flag should set true", 1000);

        runs(function() {
          expect(rst_err).toEqual(null);
          expect(rst_dirtext).toEqual(item.expectText);
        });

      });
    };
  }


  for (var i = 0,len = cases.length; i < len; i++) {
    var fn = makeTestFn(cases[i]);
    fn();
  }

});
