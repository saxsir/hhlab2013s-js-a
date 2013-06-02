// 分類器クラス
DocClass.prototype.Classifier = function(getfeatures, filename) {
  // 特徴 / カテゴリのカウント
  this.fc = {};

  // それぞれのカテゴリの中のドキュメント数
  this.cc = {};
  this.getfeatures = getfeatures;
};

// 特徴/カテゴリのカウントを増やす
DocClass.prototype.Classifier.prototype.incf = function(f, cat) {
  // 初めて出てくる特徴（単語）だったら初期化
  if (this.fc[f] === undefined) {
    this.fc[f] = {};
  }
  // その単語のカテゴリが初登場なら初期化
  if (this.fc[f][cat] === undefined) {
    this.fc[f][cat] = 0;
  }

  this.fc[f][cat] += 1;
};

// カテゴリのカウントを増やす
DocClass.prototype.Classifier.prototype.incc = function(cat) {
  if (this.cc[cat] === undefined) {
    this.cc[cat] = 0;
  }
  this.cc[cat] += 1;
};

// あるカテゴリの中に特徴が現れた数
DocClass.prototype.Classifier.prototype.fcount = function(f, cat) {
  if (f in this.fc && cat in this.fc[f]) {
    return parseFloat(this.fc[f][cat]);
  }
  return 0.0;
};

// あるカテゴリ中のアイテムたちの数
DocClass.prototype.Classifier.prototype.catcount = function(cat) {
  if (this.cc.hasOwnProperty(cat)) {
    return parseFloat(this.cc[cat]);
  }
};

// アイテムたちの総数
DocClass.prototype.Classifier.prototype.totalcount = function() {
  var sum = 0;
  for (var key in this.cc) {
    sum += this.cc[key];
  }
  return sum;
};

// すべてのカテゴリたちのリスト（配列）を返す
DocClass.prototype.Classifier.prototype.categories = function() {
  return Object.keys(this.cc);
};

// 学習用の関数
DocClass.prototype.Classifier.prototype.train = function(item, cat) {
  var features = this.getfeatures(item);
  // このカテゴリ中の特徴たちのカウントを増やす
  for (var f in features) {
    this.incf(f, cat);
  }
  // このカテゴリのカウントを増やす
  this.incc(cat);
};

// ある単語が特定のカテゴリに存在する確率を返す
DocClass.prototype.Classifier.prototype.fprob = function(f, cat) {
  if (this.catcount(cat) === 0) {
    return 0;
  }
  // このカテゴリ中にこの特徴が出現する回数を、このカテゴリの中のアイテムの総数で割る
  return this.fcount(f, cat) / this.catcount(cat);
};

// 重み付き確率
DocClass.prototype.Classifier.prototype.weightedprob = function(f, cat, prf, weight, ap) {
  if (weight === undefined){
    weight = 1.0;
  }
  if (ap === undefined) {
    ap = 0.5;
  }

  // 呼び出した関数の手前（ドットの前）のオブジェクトがthisになる。
  // ただし，手前にドットがない場合はグローバルオブジェクトがthisになる
  // つまり、prfを呼ぶ際のthisはグローバルオブジェクトになる。ので、applyを使う

  // 現在の確率を計算する
  var basicprob = prf.call(this, f, cat);

  // この特徴がすべてのカテゴリ中に出現する数を数える
  var totals = 0, cats = this.categories();
  for (var i = 0, l = cats.length; i < l; i++) {
    totals += this.fcount(f, cats[i]);
  }

  // 重み付けした平均を計算
  var bp = ((weight*ap) + (totals * basicprob)) / (weight + totals);
  return bp;
};
