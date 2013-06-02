// データベース接続関数
// setdb(dbname, function() {
//   ...
// });
DocClass.prototype.Classifier.prototype.setdb = function (dbname, callback) {
  // 1048576 = 2^20 = 1MByte
  // 2^10kbyte = 1024kbyte = 2^20byte = 1Mbyte
  this.db = openDatabase(dbname, '', dbname, 1048576);
  this.db.transaction(
    // コールバック

    function (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS fc(feature, category, count)');
      tx.executeSql('CREATE TABLE IF NOT EXISTS cc(category, count)');
    },
    // エラー時

    function (error) {
      onfailure(error, 'Error: setdb()');
    },
    // 成功時

    function () {
      onsuccess('Success: setdb()');
      callback();
    });
};

// カウント取得、増加の補助メソッドのオーバーライド
// incf(f, cat, function() {
//  ...
// });
DocClass.prototype.Classifier.prototype.incf = function (f, cat, callback) {
  var self = this;
  this.fcount(f, cat, function (res) {
      var count = res;
      var sql, data;
      if (count === 0) {
        sql = 'insert into fc values (?, ?, ?)';
        data = [f, cat, 1];
      } else {
        sql = 'update fc set count=? where feature=? and category=?';
        data = [count + 1, f, cat];
      }
      self.db.transaction(function (tx) {
          tx.executeSql(sql, data);
        }, function (error) {
          onfailure(error, 'Error: incf()');
        }, function () {
          onsuccess('Success: incf()');
          if (callback === undefined) {
            return;
          } else {
            callback();
          }
        });
    });
};

// fcount(f, cat, function(res) {
//  // res => integer
// });
DocClass.prototype.Classifier.prototype.fcount = function (f, cat, callback) {
  var res;
  this.db.transaction(function (tx) {
      tx.executeSql('select count from fc where feature=? and category=?', [f, cat],
        // データ取得成功時コールバック

        function (rt, rs) {
          if (rs.rows.length === 0) {
            res = 0;
          } else {
            res = parseFloat(rs.rows.item(0)['count']);
          }
        });
    }, function (error) {
      onfailure(error, 'Error: fcount()');
    }, function () {
      onsuccess('Success: fcount()');
      callback(res);
    });
};

DocClass.prototype.Classifier.prototype.incc = function (cat, callback) {
  var self = this;
  this.catcount(cat, function (res) {
      var count = res;
      //console.log(count);
      var sql, data;
      if (count === 0) {
        sql = 'insert into cc values (?, 1)';
        data = [cat];
      } else {
        sql = 'update cc set count=? where category=?';
        data = [count + 1, cat];
      }
      self.db.transaction(function (tx) {
          tx.executeSql(sql, data);
        }, function (error) {
          onfailure(error, 'Error: incc()');
        }, function () {
          onsuccess('Success: incc()');
          if (callback === undefined) {
            return;
          } else {
            callback();
          }
        });
    });
};

DocClass.prototype.Classifier.prototype.catcount = function (cat, callback) {
  var res;
  this.db.transaction(function (tx) {
      tx.executeSql('select count from cc where category=?', [cat], function (rt, rs) {
          if (rs.rows.length === 0) {
            res = 0;
          } else {
            res = parseFloat(rs.rows.item(0)['count']);
          }
        });
    }, function (error) {
      onfailure(error, 'Error: catcount()');
    }, function () {
      onsuccess('Success: catcount()');
      callback(res);
    });
};

// すべてのカテゴリたちのリスト（配列）を返す
DocClass.prototype.Classifier.prototype.categories = function (callback) {
  var catlist = [],
    res;
  this.db.transaction(function (tx) {
      tx.executeSql('select category from cc', [], function (rt, rs) {
          if (rs.rows.length === 0) {
            res = [];
          } else {
            for (var i = 0, l = rs.rows.length; i < l; i++) {
              catlist.push(rs.rows.item(i)['category']);
            }
            res = catlist;
          }
        });
    }, function (error) {
      onfailure(error, 'Error: categories()');
    }, function () {
      onsuccess('Success: categories()');
      callback(res);
    });
};

DocClass.prototype.Classifier.prototype.totalcount = function () {
  this.db.transaction(function (tx) {
      tx.executeSql('select sum(count from cc', [], function (rt, rs) {
          if (rs.rows.length === 0) {
            return 0;
          } else {
            return parseFloat(rs.rows.item(0)['sum(count)']);
          }
        });
    }, function (error) {
      onfailure(error, 'Error: totalcount()');
    }, function () {
      onsuccess('Success: totalcount()');
    });
};


// ある単語が特定のカテゴリに存在する確率を返す
DocClass.prototype.Classifier.prototype.fprob = function (f, cat, callback) {
  var self = this,
    res;
  this.catcount(cat, function (ccount) {
      if (ccount === 0) {
        callback(0);
      }
      // このカテゴリ中にこの特徴が出現する回数を、このカテゴリの中のアイテムの総数で割る
      self.fcount(f, cat, function (fcount) {
          callback(fcount / ccount);
        });
    });
};

// 重み付き確率
DocClass.prototype.Classifier.prototype.weightedprob = function (f, cat, prf, weight, ap, callback) {
  if (weight === undefined) {
    weight = 1.0;
  }
  if (ap === undefined) {
    ap = 0.5;
  }

  // 現在の確率を計算する
  var self = this;
  prf.call(this, f, cat, function (res) {
      var basicprob = res;

      // この特徴がすべてのカテゴリ中に出現する数を数える
      var totals = 0;
      self.categories(function (res) {
          var cats = res;
          var n = cats.length;
          var fcountNext = function (i) {
            if (i >= n) {
              // 重み付けした平均を計算
              var bp = ((weight * ap) + (totals * basicprob)) / (weight + totals);
              callback(bp);
              return;
            }
            self.fcount(f, cats[i], function (res) {
                totals += res;
                fcountNext(i + 1);
              });
          };
          fcountNext(0);
        });
    });
};


// 学習用の関数
DocClass.prototype.Classifier.prototype.train = function (item, cat, callback) {
  var features = this.getfeatures(item);

  // このカテゴリのカウントを増やす
  this.incc(cat);

  var self = this,
    f = Object.keys(features),
    n = f.length;
  // incfが全て終わってからreturnする
  var incfNext = function (i) {
    if (i >= n) {
      callback();
      return;
    }
    self.incf(f[i], cat, function () {
        incfNext(i + 1);
      });
  };
  incfNext(0);
};

// トレーニングデータを流し込む
// オブジェクトのリストでデータを渡すように改良したい
DocClass.prototype.sampletrain = function (cl, callback) {
  cl.train('Nobody owns the water', 'good', function () {
      cl.train('the quick rabbit jumps fences', 'good', function () {
          cl.train('buy pharmaceuticals now', 'bad', function () {
              cl.train('make quick money at the online casino', 'bad', function () {
                  cl.train('the quick brown fox jumps', 'good', function () {
                      callback();
                    });
                });
            });
        });
    });
};

var onfailure = function (error, msg) {
  alert('エラーが発生しました エラーコード：' + error.code + ', エラーメッセージ：' + error.message);
  console.log(msg);
};
var onsuccess = function (msg) {
  //console.log(msg);
};
