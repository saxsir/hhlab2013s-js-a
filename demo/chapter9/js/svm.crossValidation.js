svmjs.SVM.prototype.crossValidation = function(data, labels, opts, k) {
  // サブセットクラス
  var Subset = function() {
    this._data = [];
    this._labels = [];
  };

  // データセットをk個のサブセットに分割する
  var subsets = [];
  for (var i = 0; i < k; i++) {
    subsets.push(new Subset());
  }

  // ここでランダムに、かつ均等に分けないといけない。
  var n = data.length;
  for (var i = 0; i < n; i++) {
    var group = i % k;
    var rnd = Math.floor(Math.random() * data.length);
    var d = data.splice(rnd, 1);
    var l = labels.splice(rnd, 1);
    Array.prototype.push.apply(subsets[group]._data, d);
    Array.prototype.push.apply(subsets[group]._labels, l);
  }
 
  /*
  data.forEach(function(d, i){
    var group = i % k;
    subsets[group]._data.push(d);
    subsets[group]._labels.push(labels[i]);
  });
  */

  // console.log(subsets); // debug

  // 1つのサブセットをテスト用にして、残りでsvmをトレーニングする
  // これをk回（各サブセット分）繰り返す
  // k回分の検証結果の配列を返す
  var self = this;
  var hit = 0;
  subsets.forEach(function(subset, i){
    var test_data = subset._data;
    var test_label = subset._labels;
    var training_data = [];
    var training_labels = [];

    // $.extendで値渡しで配列のコピー
    var subsets_copy = $.extend(true, [], subsets);
    subsets_copy.splice(i, 1);

    // console.log('group ' + i); // debug
    // console.log(test_data); // debug
    // console.log(test_label); // debug
    // console.log('subset');
    // console.log(subsets);
    // console.log('copy spliced');
    // console.log(subsets_copy);

    subsets_copy.forEach(function(other){
      // どっちも同じだけどpushの方が圧倒的に早い
      // training_data = training_data.concat(other._data);
      // training_labels = training_labels.concat(other._labels);
      Array.prototype.push.apply(training_data, other._data);
      Array.prototype.push.apply(training_labels, other._labels);
    });
    var sub_svm = new svmjs.SVM();
    sub_svm.train(training_data, training_labels, opts);
    // console.log(sub_svm.predict([ [0.65625,1,0,0.78125,0,1,0.3] ])); // -1 debug
    // console.log(sub_svm.predict([ [0.15625,0,0,0.375,0,0,0.2] ])); // 1 debug

    test_data.forEach(function(d, i){
      //console.log(d); // debug
      var guess = sub_svm.predict([d]);
      console.log('guess: ' + guess);
      console.log('answer: ' + training_labels[i]);
      if (guess == training_labels[i]) {
        console.log('hit!');
        hit++;
      }
    });
  });
  // return (num of all data)- (num of correct answers)
  return hit;
};
