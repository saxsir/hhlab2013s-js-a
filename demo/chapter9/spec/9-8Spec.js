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
  } else if (v == 1) {
    array[i] = '1';
  }
});

var svm = new svmjs.SVM();
svm.train(inputs, answers, { kernel: 'rbf', rbfsigma: 0.5 });
var newrow = [28.0, -1, -1, 26.0, -1, 1, 2, 0.8]; // 男は子どもを望んでいないが、女は望んでいる
console.log(svm.predict([scalef(newrow)])); // 0.0

newrow = [28.0, -1, 1, 26.0, -1, 1, 2, 0.8];  // 両者ともに子どもを望んでいる
console.log(svm.predict([scalef(newrow)])); // 1.0

var json = svm.toJSON();
console.log(JSON.stringify(json));
*/

// 結果見たいだけならここのコメントを外す
/*
var json = $('#svm_json').val();
var svm = new svmjs.SVM();
svm.fromJSON(JSON.parse(json));

var newrow = [28.0, -1, -1, 26.0, -1, 1, 2, 0.8]; // 男は子どもを望んでいないが、女は望んでいる
console.log(svm.predict([scalef(newrow)])); // 0.0

newrow = [28.0, -1, 1, 26.0, -1, 1, 2, 0.8];  // 両者ともに子どもを望んでいる
console.log(svm.predict([scalef(newrow)])); // 1.0

//  交差検定の確認
console.log(svm.predict([[0.65625,1,0,0.78125,0,1,0.3]])); // -1
console.log(svm.predict([ [0.1875, 0, 0, 0.71875, 0, 1, 0.2] ])); // 1
*/

// 交差検定
var inputs = []; // data
var answers = []; // labels

scaledset.forEach(function(r){
  inputs.push(r.data);
  answers.push(r.match);
});

// データの変換, クラス0を-1にする（svm.jsが-1 or 1でクラス判別するので）
answers.forEach(function(v, i, array){
  if (v == 0) {
    array[i] = '-1';
  } else if (v == 1) {
    array[i] = '1';
  }
});

$('#crossValidation').click(function() {
  var svm = new svmjs.SVM();
  var num_of_correct_answers = svm.crossValidation(inputs, answers, { kernel: 'rbf', rbfsigma: 0.5 }, 2); // 正答数を返す
  alert(num_of_correct_answers); // 
});


/*
var sum = 0;
guesses.forEach(function(g, i){
  sum += Math.abs(answers[i] - g);
});
console.log(sum);
*/
