var numericalset = advancedclassify.loadnumerical();
var res = advancedclassify.scaledata(numericalset);

var scaledset = res[0];
var scalef = res[1];
var avgs = advancedclassify.lineartrain(scaledset);

console.log(numericalset[0].data); // [39.0, 1, -1, 43.0, -1, 1, 0, 0.9011060..]
console.log(numericalset[0].match); // 0
console.log(advancedclassify.dpclassify(scalef(numericalset[0].data), avgs)); // 1

console.log(numericalset[11].match); // 1
console.log(advancedclassify.dpclassify(scalef(numericalset[11].data), avgs)); // 1
