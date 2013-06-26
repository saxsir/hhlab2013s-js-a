var agesonly = advancedclassify.loadmatch('agesonly.csv', true);

var offset = advancedclassify.getoffset(agesonly);
console.log(advancedclassify.nlclassify([30, 30], agesonly, offset)); // 1
console.log(advancedclassify.nlclassify([30, 25], agesonly, offset)); // 1
console.log(advancedclassify.nlclassify([25, 40], agesonly, offset)); // 0
console.log(advancedclassify.nlclassify([48, 20], agesonly, offset)); // 0


var numericalset = advancedclassify.loadnumerical();
var res = advancedclassify.scaledata(numericalset);
var scaledset = res[0];
var scalef = res[1];

var ssoffset = advancedclassify.getoffset(scaledset);
console.log(numericalset[0].match); // 0
console.log(advancedclassify.nlclassify(scalef(numericalset[0].data), scaledset, ssoffset)); // 0
console.log(numericalset[1].match);
console.log(advancedclassify.nlclassify(scalef(numericalset[1].data), scaledset, ssoffset)); // 1
console.log(numericalset[2].match);
console.log(advancedclassify.nlclassify(scalef(numericalset[2].data), scaledset, ssoffset)); // 0

var newrow = [28.0, -1, -1, 26.0, -1, 1, 2, 0.8]; // 男は子どもを望んでいないが、女は望んでいる
console.log(advancedclassify.nlclassify(scalef(newrow), scaledset, ssoffset)); // 0
newrow = [28.0, -1, 1, 26.0, -1, 1, 2, 0.8];  // 両者ともに子どもを望んでいる
console.log(advancedclassify.nlclassify(scalef(newrow), scaledset, ssoffset)); // 1
