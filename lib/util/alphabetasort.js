function charSort(a, b) {
  var _a = a.toLowerCase();
  var _b = b.toLowerCase();
  if(_a < _b) return -1;
  if(_a > _b) return 1;
  return 0;
}

module.exports = function(x, y){
  var a,b,r,len;

  a = x[0], b = y[0];
  r = charSort(a, b);

  if(r!==0) return r;

  len = Math.min(x.length,y.length);

  for(var i=1;i<len;i++){
    a = x[i];
    b = y[i];
    r = charSort(a, b);
    if(r!==0) return r;
  }

  var diff = x.length - y.length;
  if(diff < 0) return -1;
  if(diff > 0) return 1;
  return 0;
};
