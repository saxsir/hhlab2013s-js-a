// 6章の内容を内包するクラス
var DocClass = function () {};

/*
 * テキストから特徴を抽出する関数
 * ドキュメントを受け取り、ユニークな単語とそれぞれの初期値(1)をオブジェクトで返す
 */
DocClass.prototype.getwords = function (doc) {
  // 単語を非アルファベットの文字で分割する
  var words = doc.split(/\W/);

  // ユニークな単語のみの集合を返す
  var dict = {};
  for (var i = 0; i < words.length; i++) {
    // 元の文字列に非アルファベットが連続して入っていると中身なしのStringとして分割されるため
    if (words[i] === "") {
      delete words[i];
    } else {
      dict[words[i]] = 1;
    }
  }
  return dict;
};

/*
 * トレーニングデータを流し込む
 */
DocClass.prototype.sampletrain = function (cl) {
  cl.train('Nobody owns the water', 'good');
  cl.train('the quick rabbit jumps fences', 'good');
  cl.train('buy pharmaceuticals now', 'bad');
  cl.train('make quick money at the online casino', 'bad');
  cl.train('the quick brown fox jumps', 'good');
  console.log('Success: sample training');
};
