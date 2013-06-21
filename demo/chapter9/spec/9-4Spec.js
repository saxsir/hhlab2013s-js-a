// 9.4.3 距離を決定する
// getlocationを同期的に扱いたいので呼び出し元で工夫する


var latlng = advancedclassify.getlocation('1 alewife center, cambridge, ma');
console.log(latlng); // (42.398662999..., -71.1405129999....)

var distance = advancedclassify.milesdistance('cambridge, ma', 'new york,ny');
console.log(distance); // 191.779524...

var numericalset = advancedclassify.loadnumerical();
console.log(numericalset[0].data); // [39.0, 1, -1, 43.0, -1, 1, 0, 6.7295...]

/*
var latlng;
advancedclassify.getlocation('1 alewife center, cambridge, ma', function(res) {
  latlng = res;
  console.log(latlng);
}); // (42.398662999..., -71.1405129999....)

var distance;
advancedclassify.milesdistance('cambridge, ma', 'new york,ny', function(res) {
  distance = res;
  console.log(distance);
}); // 191.779524...
*/


// 9.4.4 新たなデータセットの作成
/*
advancedclassify.loadnumerical(function(res) {
  console.log(res[0].data); // [39.0, 1, -1, 43.0, -1, 1, 0, 6.7295...]
});
*/
