var agesonly = advancedclassify.loadmatch('agesonly.csv', true);
var avgs = advancedclassify.lineartrain(agesonly);

console.log(advancedclassify.dpclassify([30,30], avgs)); // => 1
console.log(advancedclassify.dpclassify([30,25], avgs)); // => 1
console.log(advancedclassify.dpclassify([25,40], avgs)); // => 0
console.log(advancedclassify.dpclassify([48,20], avgs)); // => 1
