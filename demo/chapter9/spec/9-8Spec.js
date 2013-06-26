// とりあえずsvm.jsを使ってみる
/*
var data = [[0,0], [0,1], [1,0], [1,1]];
var labels = [-1, 1, 1, -1];
var svm = new svmjs.SVM();
svm.train(data, labels, {C: 1.0}); // C is a parameter to SVM

var testdata = [[0,1]]; // ??
var testlabels = svm.predict(testdata); // predict → 予想する
console.log(testlabels);
*/



var numericalset = advancedclassify.loadnumerical();
var res = advancedclassify.scaledata(numericalset);
var scaledset = res[0];
var scalef = res[1];

// トレーニングするならこのコメント外す
/*
var inputs = []; // data
var answers = []; // labels

scaledset.forEach(function(r){
  inputs.push(r.data);
  answers.push(r.match);
});

answers.forEach(function(v, i, array){
  if (v == 0) {
    array[i] = '-1';
  }
});
console.log(answers);

var svm = new svmjs.SVM();
svm.train(inputs, answers, { kernel: 'rbf', rbfsigma: 0.5 });
*/

var json = $('#svm_json').val();
var svm = new svmjs.SVM();
svm.fromJSON(JSON.parse(json));

var newrow = [28.0, -1, -1, 26.0, -1, 1, 2, 0.8]; // 男は子どもを望んでいないが、女は望んでいる
console.log(svm.predict([scalef(newrow)])); // 0.0

newrow = [28.0, -1, 1, 26.0, -1, 1, 2, 0.8];  // 両者ともに子どもを望んでいる
console.log(svm.predict([scalef(newrow)])); // 1.0
