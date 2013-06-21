var advancedclassify = {};

// matchrowクラス
advancedclassify.MatchRow = function(row, allnum) {
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
  this.match = row[row.length-1];
};

// matchrowクラスの配列を作成する関数
// CSVは同期処理で読み込む
advancedclassify.loadmatch = function(f, allnum) {
  // CSVを配列に変換する関数
  // http://ameblo.jp/hollow-nage/entry-11512841947.html から拝借
  // Chromeの場合は --allow-file-access-from-files オプションをつけて起動しないとたぶん動かない
  this.csv2Array = function(filePath) {
    var csvData = [];
    var lines = $.ajax({
      type: 'get',
      url: filePath,
      async: false
    }).responseText.split('\n');

    var cells = [];
    for (i = 0, n = lines.length; i <n;++i) {
      cells = lines[i].split(",");
      if( cells.length != 1 ) {
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

advancedclassify.lineartrain = function(rows) {
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
      row.data.forEach(function() {
        averages[cl].push(0.0);
      });
   }
    if (counts[cl] === undefined) {
      counts[cl] = 0;
    }

    // このポイントをaveragesに追加
    row.data.forEach(function(value, index) {
      averages[cl][index] += parseFloat(value);
    });

    // それぞれのクラスにいくつのポイントがあるのかを記録
    counts[cl] += 1;
  }

  // 平均を得るため合計をcountsで割る
  for (var key in averages) {
    var cl = key;
    var avg = averages[cl];
    avg.forEach(function(value, index) {
      avg[index] /= counts[cl];
    });
  }

  return averages;
};
