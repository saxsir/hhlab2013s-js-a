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
