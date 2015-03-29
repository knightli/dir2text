//jest.dontMock('../dir2json');
jest.autoMockOff();

var dir2json = require('../dir2json'),
  fs = require('fs'),
  rootDir = './',
  testDir = rootDir + 'test/';

describe('dir2json test', function() {

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
    for(var p in obj2) {
      o[p] = obj2[p];
    }
    return o;
  }

  function getRegularCases(){
    var cases = [];
    for(var i=1;i<8;i++) {
      cases.push({
        index: i,
        opt: mixin(defaults, {dir:testDir+'dirs/test'+i}),
        expectJson: JSON.parse(fs.readFileSync(testDir+'expect/test'+i+'.json','utf-8'))
      });
    }
    return cases;
  }

  var cases = getRegularCases();
  var left = cases.length;

  function makeTestFn(item) {

    return function() {

      var rst_dirjson,rst_err, flag;

      it("check json for test"+item.index, function() {

        runs(function() {
          flag = false;
          value = void(0);
          dir2json(item.opt, function(err, dirjson){
            rst_err = err;
            rst_dirjson = dirjson;
            flag = true;
          });
        });

        waitsFor(function() {
          return flag;
        }, "The flag should set true", 1000);

        runs(function() {
          expect(rst_err).toEqual(null);
          expect(rst_dirjson).toEqual(item.expectJson);
        });

      });
    };
  }


  for(var i=0,len=cases.length; i<len; i++) {
    var fn = makeTestFn(cases[i]);
    fn();
  }

});
