var advancedclassify = {};

// matchrowクラス
advancedclassify.MatchRow = function (row, allnum) {
  if (allnum === undefined) {
    allnum = false;
  }
  var i, n;
  this.data = [];
  if (allnum) {
    for (i = 0, n = row.length - 1; i < n; i++) {
      this.data.push(parseFloat(row[i]));
    }
  } else {
    for (i = 0, n = row.length - 1; i < n; i++) {
      this.data.push(row[i]);
    }
  }
  this.match = row[row.length - 1]; // String
};

// matchrowクラスの配列を作成する関数
// CSVは同期処理で読み込む
advancedclassify.loadmatch = function (f, allnum) {
  // CSVを配列に変換する関数
  // http://ameblo.jp/hollow-nage/entry-11512841947.html から拝借
  // Chromeの場合は --allow-file-access-from-files オプションをつけて起動しないとたぶん動かない
  this.csv2Array = function (filePath) {
    var csvData = [];
    var lines = $.ajax({
      type: 'get',
      url: filePath,
      async: false
    }).responseText.split('\n');

    var cells = [];
    for (i = 0, n = lines.length; i < n; ++i) {
      cells = lines[i].split(",");
      if (cells.length != 1) {
        csvData.push(cells);
      }
    }
    return csvData;
  };

  var data = this.csv2Array(f);
  var rows = [];
  for (i = 0, n = data.length; i < n; i++) {
    rows.push(new this.MatchRow(data[i]));
  }
  return rows;
};

// 各クラスの平均を返す関数
advancedclassify.lineartrain = function (rows) {
  var averages = {}, counts = {};

  // rowsはオブジェクトが渡されるはずなのでfor..in文で
  for (var key in rows) {
    var row = rows[key];
    // このポイントのクラスを取得
    var cl = row.match;

    // averagesとcountsにキーがなかったら初期化
    if (averages[cl] === undefined) {
      averages[cl] = [];
      // row.dataは配列なのでforEach文
      row.data.forEach(function () {
        averages[cl].push(0.0);
      });
    }
    if (counts[cl] === undefined) {
      counts[cl] = 0;
    }

    // このポイントをaveragesに追加
    row.data.forEach(function (value, index) {
      averages[cl][index] += parseFloat(value);
    });

    // それぞれのクラスにいくつのポイントがあるのかを記録
    counts[cl] += 1;
  }

  // 平均を得るため合計をcountsで割る
  // 
  for (var key in averages) {
    var cl = key;
    var avg = averages[cl]; // 配列は参照渡しなのでavgを更新するとaverages[cl]も更新される
    avg.forEach(function (value, index) {
      avg[index] /= counts[cl];
    });
  }
  return averages;
};

// ドット積を返す関数
advancedclassify.dotproduct = function (v1, v2) {
  var sum = 0;
  var i, n;
  for (i = 0, n = v1.length; i < n; i++) {
    sum += v1[i] * v2[i];
  }
  return sum;
};

// ドット積を使ってクラス分類する関数
// 基本的には二値分類にしか使えない
advancedclassify.dpclassify = function (point, avgs) {
  // avgs[0]とかでオブジェクトのキーにアクセスできなかったのでちょっとだけ改変
  // 初歩的なところが解決できなかった。。
  var clses = Object.keys(avgs);
  var cl_A = clses[0]; // 1
  var cl_B = clses[1]; // 0

  var b = (this.dotproduct(avgs[cl_A], avgs[cl_A]) - this.dotproduct(avgs[cl_B], avgs[cl_B])) / 2;
  var y = this.dotproduct(point, avgs[cl_B]) - this.dotproduct(point, avgs[cl_A]) + b;


  if (y > 0) {
    return cl_B;
  } else {
    return cl_A;
  }
};

// イエス・ノークエスチョン
advancedclassify.yesno = function (v) {
  if (v === 'yes') {
    return 1;
  } else if (v === 'no') {
    return -1;
  } else {
    return 0;
  }
};

// リスト中の一致するアイテムの数を返す関数
advancedclassify.matchcount = function (interest1, interest2) {
  var l1 = interest1.split(':');
  var l2 = interest2.split(':');
  var x = 0;

  l1.forEach(function (value) {
    if (l2.indexOf(value)) {
      x += 1;
    }
  });

  return x;
};

// データセットを読み込んで、列を変換する
// 位置情報はとりあえず削除して考える
advancedclassify.loadnumerical = function () {
  // var oldrows = this.loadmatch('matchmaker.csv');
  var oldrows = this.loadmatch('matchmaker.csv');
  var newrows = [];
  var self = this;
  oldrows.forEach(function (row) {
    var d = row.data;
    // 位置は含めない
    // var data = [d[0], self.yesno(d[1]), self.yesno(d[2]), d[5], self.yesno(d[6]), self.yesno(d[7]), self.matchcount(d[3], d[8]), self.milesdistance(d[4], d[9]), row.match];
    var data =  [d[0], self.yesno(d[1]), self.yesno(d[2]), d[5], self.yesno(d[6]), self.yesno(d[7]), self.matchcount(d[3], d[8]), row.match];
    newrows.push(new self.MatchRow(data));
  });
  return newrows;
};

// ダミーの位置情報取得関数
advancedclassify.getlocation = function () {
  return 0.0;
};
advancedclassify.milesdistance = function () {
  return 0.0;
};

// すべてのデータを共通の尺度に変換する関数
advancedclassify.scaledata = function (rows) {
  var low = [], high = [];
  rows[0].data.forEach(function() {
    low.push(999999999.0);
    high.push(-999999999.0);
  });

  // 最高と最低の値を探す
  for (var key in rows) {
    var row = rows[key];
    var d = row.data;
    d.forEach(function(value, i) {
      if (value < low[i]) {
        low[i] = value;
      }
      if (value > high[i]) {
        high[i] = value;
      }
    });
  }

  // データを縮尺する関数
  function scaleinput(d) {
    var res = [];
    low.forEach(function(value, i) {
      res.push((d[i] - value) / (high[i] - value));
    });
    return res;
  }

  // すべてのデータを縮尺する
  var newrows = [];
  for (var key in rows) {
    var row = rows[key];
    var data = scaleinput(row.data);
    data.push(row.match);
    newrows.push(new this.MatchRow(data));
  }

  // 新しいデータと関数を返す
  return [newrows, scaleinput];
};

// カーネルトリックで用いるradial-basis関数
// 二つのベクトルを受け取り、一つの値を返す
advancedclassify.rbf = function(v1, v2, gamma) {
  if (gamma === undefined) {
    gamma = 20;
  }

  var dv = [];
  v1.forEach(function(v, i){
    dv.push(v - v2[i]);
  });

  var l = 0;
  dv.forEach(function(p) {
    l += Math.pow(p, 2);
  });
  return Math.pow(Math.E, (-gamma * l));
};

// ある点とクラス中のその他のすべての点の間のradial-basis関数を適用した値を計算し、それらの平均を出す
// ベクトルの集合を平均し、その平均とベクトルAの内積 = ベクトルAと集合中のすべてのベクトルとの内積の平均
advancedclassify.nlclassify = function(point, rows, offset, gamma) {
  if (gamma === undefined) {
    gamma = 10;
  }

  var sum0 = 0.0, sum1 = 0.0, count0 = 0, count1 = 0;
  var self = this;
  rows.forEach(function(row){
    // matchが文字でも数値でも判定はOK
    if (row.match == 0) {
      sum0 += self.rbf(point, row.data, gamma);
      count0 += 1;
    }
    else {
      sum1 += self.rbf(point, row.data, gamma);
      count1 += 1;
    }
  });

  var y = (1.0 / count0) * sum0 - (1.0 / count1) * sum1 + offset;
  if (y > 0) {
    return 0;
  }
  else {
    return 1;
  }
};

// offsetの値を返す
advancedclassify.getoffset = function(rows, gamma) {
  var l0 = [], l1 = [];
  rows.forEach(function(row){
    if (row.match == 0) {
      l0.push(row.data);
    }
    else {
      l1.push(row.data);
    }
  });

  var sum0 = 0, sum1 = 0;
  var self = this;
  l0.forEach(function(v2){
    l0.forEach(function(v1){
      sum0 += self.rbf(v1, v2, gamma);
    });
  });

  l1.forEach(function(v2){
    l1.forEach(function(v1){
      sum1 += self.rbf(v1, v2, gamma);
    });
  });

  return (1.0 / Math.pow(l1.length, 2)) * sum1 - (1.0 / Math.pow(l0.length, 2)) * sum0;
};


// 位置情報とるならここから下を編集

// 距離を求める関数
/*
advancedclassify.milesdistance = function (a1, a2, callback) {
  var lat1, lat2, long1, long2;
  this.getlocation(a1, function(res) {
    lat1 = res[0];
    long1 = res[1];
  });
  this.getlocation(a2, function(res) {
    lat2 = res[0];
    long2 = res[1];
  });

  var timer_id = setInterval(function() {
    if (lat1 && long1 && lat2 && long2) {
      clearInterval(timer_id);
      var latdif = 69.1 * (lat2 - lat1);
      var longdif = 53.0 * (long2 - long1);
      var result = Math.pow((Math.pow(latdif, 2) + Math.pow(longdif, 2)), 0.5);
      callback(result);
    }
  }, 100);
};
*/

// 緯度と経度を取得する関数（非同期）
// Google MapsのAPIで実装
// ここから拝借 → http://www.nanchatte.com/map/getLatLngByAddress.html
// 衝撃の事実 → 地図に表示せずにジオコーディングの結果だけを利用することは禁止されています。
/*
advancedclassify.getlocation = function (address, callback) {
  // var googlekey = 'AIzaSyDYMJdI95bpTvwkTUyzm6bDXVPRaJVy4Hs';
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({
    address: address
  }, function (results, status) {
    console.log(status);
    // 候補がいくつか返ってくる場合は気にしないで最初の候補を取得
    if (results[0].geometry) {
      // 緯度経度を取得
      var latlng = results[0].geometry.location;
      callback([latlng.jb, latlng.kb]);
    } else if (status == google.maps.GeocoderStatus.ERROR) {
        alert("サーバとの通信時に何らかのエラーが発生！");
      } else if (status == google.maps.GeocoderStatus.INVALID_REQUEST) {
        alert("リクエストに問題アリ！geocode()に渡すGeocoderRequestを確認せよ！！");
      } else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
        alert("短時間にクエリを送りすぎ！落ち着いて！！");
      } else if (status == google.maps.GeocoderStatus.REQUEST_DENIED) {
        alert("このページではジオコーダの利用が許可されていない！・・・なぜ！？");
      } else if (status == google.maps.GeocoderStatus.UNKNOWN_ERROR) {
        alert("サーバ側でなんらかのトラブルが発生した模様。再挑戦されたし。");
      } else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
        alert("見つかりません");
      } else {
        alert("えぇ～っと・・、バージョンアップ？");
      }
  });
};
*/

// なんか日本の住所しかとれねぇ
// yahooのジオコーダーAPIとかいうやつである。
/*
advancedclassify.getlocation = function(address) {
  var yahoo_id = 'dj0zaiZpPVhRaE9UNzBtWUkwRiZkPVlXazlTRWR2WjFsck5HTW1jR285TUEtLSZzPWNvbnN1bWVyc2VjcmV0Jng9ZmE-';
  $.ajax({
    url: 'http://geo.search.olp.yahooapis.jp/OpenLocalPlatform/V1/geoCoder',
    data: {
      appid: yahoo_id,
      query: encodeURIComponent(address),
      output: 'json',
      recursive: true
    },
    async: false,
    dataType: 'jsonp',
    success: function(data) {
      console.log(data);
    }
  });
};
*/

// 海外のPlaceFinderとやらはなんかPricingとか書いてあるけど
// 無料で使えるのでしょうか。もう緯度と経度なくていいよね。
/*
advancedclassify.getlocation = function(address) {
  var yahoo_id = 'dj0yJmk9bWpKcUVNZEVpdE16JmQ9WVdrOWFHRkJTbmw0Tm1zbWNHbzlNakEwT0RVMU1USTJNZy0tJnM9Y29uc3VtZXJzZWNyZXQmeD1hMw--';
};
*/
