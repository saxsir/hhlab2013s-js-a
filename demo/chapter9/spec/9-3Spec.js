var agesonly = advancedclassify.loadmatch('agesonly.csv', true);
var avgs = advancedclassify.lineartrain(agesonly);

console.log(avgs);
