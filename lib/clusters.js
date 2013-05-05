var Clusters = function () {}
/*
 * 指定されたファイルを読み込む関数
 * ファイルの1行目をcolnames, 1列目をrownames, それ以外をdataに入れて返す
 */
Clusters.prototype.readFile = function (file, callback) {
  var lines = [];

  // とりあえずファイルの中身をぜんぶ読み込む
  var reader = new FileReader();
  reader.readAsText(file);

  // ファイルを読み込み終わったら呼ばれる関数
  reader.onload = function (e) {
    var colNames = [], rowNames = [], data = [];
    var text = e.target.result;

    // ファイルの中身を改行文字で区切ってlines配列に入れる
    lines = $.trim(text).split('\n');
    
    // 1行目は単語のリスト
    colNames = $.trim(lines[0]).split('\t');
    colNames.splice(0, 1);

 
    // iは1から（ブログの数だけ繰り返す）
    var length = lines.length;
    for (var i = 1; i < length; i++) {
      var p = $.trim(lines[i]).split('\t');
      // それぞれの行の1列目はブログの名前なのでrownamesに追加
      rowNames.push(p[0]);

      // 行の残りの部分がその行のデータ（単語の数だけ繰り返す）
      var tmpArray = [];
      var length_2 = p.length;
      for (var j = 1; j < length_2; j++) {
        tmpArray.push(p[j]);
      }
      data.push(tmpArray);
    }

    callback([rowNames, colNames, data]);
    return;
  }
}

/*
 * 階層的クラスタリングを実行してくれる関数
 * 
 */
Clusters.prototype.hcluster = function (_rows, _distance) {
  // 距離の定義が指定されていなければとりあえずピアソンにしとく
  if (typeof _distance === 'undefined') {
    var distance = this.pearson;
  } else {
    var distance = _distance;
  }

  var clust = [], self = this;
  // クラスタは最初は行たち
  _rows.forEach(function (value, index) {
    clust.push(self.bicluster(value, null, null, 0.0, index));
  });

  // クラスタが1つになるまで繰り返す
  var distances = {}, currentClustId = -1;
  while (clust.length > 1) {
    var lowestPair = [0, 1];
    var closestDist = distance(clust[0].vec, clust[1].vec);

    // すべての組み合わせをチェックし、最も近い距離のペアを返す
    var length = clust.length;
    for (var i = 0; i < length; i++) {
      for (var j = i + 1; j < length; j++) {
        // 初登場の組み合わせなら距離を計算する
        if (![clust[i].id, clust[j].id] in distances) {
          // 配列をキーに距離を記憶しておく（こんな使い方でいいのかな...）
          // 二次元の配列にして、そこに距離の値を入れていけばいいのでは？初期値は-1とかにしておく。
          distances[[clust[i].id, clust[j].id]] = distance(clust[i].vec, clust[j].vec);
        }

        var d = distances[[clust[i].id, clust[j].id]];

        if (d < closestDist) {
          closestDist = d;
          lowestPair = [i, j];
        }
      }
    }

    // 2つのクラスタの平均を計算する
    var mergeVec = [];
    var length = clust[0].vec.length;
    for (var i = 0; i < length; i++) {
      mergeVec.push((clust[lowestPair[0]].vec[i] + clust[lowestPair[1]].vec[i]) / 2.0);
    }

    // 新たなクラスタをつくる
    var newCluster = this.bicluster(mergeVec, clust[lowestPair[0]], clust[lowestPair[1]], closestDist, currentClustId);

    // 元のセットではないクラスタのIDは負にする
    // デンドログラム描く時に区別したいので。
    currentClustId -= 1;
    clust.splice(0, 2);
    clust.push(newCluster);
  }

  console.log('Finish hclustering.');
  return clust[0];
}


/*
 * 配列を2つ受け取り、ピアソン相関係数を返す
 */
Clusters.prototype.pearson = function (v1, v2) {
  var sum1 = 0,
    sum2 = 0,
    sum1Sq = 0,
    sum2Sq = 0,
    pSum = 0;

  // v1とv2の長さは同じ（だとピアソンは信じてる）
  var len = v1.length;

  // for文を1回にまとめた
  for (var i = 0; i < len; i++) {
    // 単純な合計（parseFloatかIntしないと文字列の結合になる）
    // たぶんテキストから文字列でデータを読み込んでいるからだと思われる
    // JSONで書いてれば大丈夫だったのか...2時間くらいエラー探しましたよ....
    sum1 += parseFloat(v1[i]);
    sum2 += parseFloat(v2[i]);

    // 平方の合計
    sum1Sq += Math.pow(v1[i], 2);
    sum2Sq += Math.pow(v2[i], 2);

    // 積の合計
    pSum += v1[i] * v2[i];
  }

  // ピアソン相関スコアを算出する
  var num = pSum - (sum1 * sum2 / len);
  var den = Math.sqrt( (sum1Sq - Math.pow(sum1, 2) / len) * (sum2Sq - Math.pow(sum2, 2) / len) );

  if (den === 0) {
    return 0;
  }

  return 1.0 - num / den;
}

/*
 * 新しいクラスタオブジェクトを生成して返す関数
 */
Clusters.prototype.bicluster = function (vec, left, right, distance, id) {
  var Cluster = {
    vec: vec,
    left: left,
    right: right,
    distance: distance,
    id: id
  };
  return Cluster;
}

/*
 * とりあえずランダムにアイテムを配置し、
 * 現在のすべてのアイテム間の距離を求め、目標値（データセットから求めた距離）との誤差を最小に近づけ
 * 各アイテムの位置の配列を返す関数
 */
Clusters.prototype.scaleDown = function (data, distance, rate) {
  if (typeof distance === 'undefined') {
    distance = this.pearson;
  }
  if (typeof rate === 'undefined') {
    rate = 0.01;
  }

  var n = data.length;
  // アイテムのすべての組の実際の距離
  var realDist = [];
  for (var i=0; i < n; i++) {
    realDist[i] = [];
    for (var j=0; j < n; j++) {
      realDist[i][j] = distance(data[i], data[j]);
    }
  }
  //var outerSum = 0;

  // ２次元上にランダムに配置するように初期化する
  var loc = [], fakeDist = [];
  for (var i = 0; i < n; i++) {
    loc[i] = [Math.random(), Math.random()];
    fakeDist[i] = [];
    for (var j =0; j < n; j++) {
      fakeDist[i][j] = 0;
    }
  }

  var lastError;
  for (var m =0; m < 1000; m++) {
    // 予測距離を計る
    for (var i =0; i < n; i++) {
      for (var j = 0; j < n; j++) {
        var sum = 0;
        for (var x = 0; x < 2; x++) {
          sum += Math.pow((loc[i][x] - loc[j][x]), 2);
        }
        fakeDist[i][j] = Math.sqrt(sum);
      }
    }

    // ポイントの移動
    var grad = [];
    for (var i =0; i < n; i++) {
      grad[i] = [0, 0];
    }

    var totalError = 0;
    for (var k = 0; k < n; k++) {
      for (var j = 0; j < n; j++) {
        // 同じアイテム同士の比較はスキップ
        if (j === k) {
          continue;
        }
        // 誤差は距離の差の百分率
        var errorTerm = (fakeDist[j][k] - realDist[j][k]) / realDist[j][k];

        // 他のポイントへの誤差に比例してそれぞれのポイントを修正する必要がある
       grad[k][0] += ((loc[k][0] - loc[j][0]) / fakeDist[j][k]) * errorTerm;
       grad[k][1] += ((loc[k][1] - loc[j][1]) / fakeDist[j][k]) * errorTerm;

        // 誤差の合計を記録
        totalError += Math.abs(errorTerm);
      }
    }

    // console.log(totalError);

    // ポイントを移動することで誤差が悪化したら終了
    if (lastError && lastError < totalError) {
      console.log('totalError: ' + totalError);
      break;
    }
    lastError = totalError;

    // 学習率と傾斜を掛けあわせてそれぞれのポイントを移動
    for (var k = 0; k < n; k++) {
      loc[k][0] -= rate * grad[k][0];
      loc[k][1] -= rate * grad[k][1];
    }
  }
  console.log('Finish scale down.');
  return loc;
}

/*
 * 2次元のデータセットを引数に描画する関数
 */
 Clusters.prototype.draw2d = function (data, labels, id) {
  var width = 2000;
  var height = 2000;
  var ctx = this.initCanvas(id, width, height);

  var length = data.length;
  for (var i=0; i < length; i++) {
    var x = (data[i][0] + 0.5) * 1000;
    var y = (data[i][1] + 0.5) * 1000;
    console.log(x);
    console.log(y);
    ctx.fillText(labels[i], x, y);
  }
  console.log('Finish draw2d.');
}

/*
 * Canvasの初期化関数
 */
Clusters.prototype.initCanvas = function(id, width, height) {
  var canvas = document.getElementById(id);
  if (!canvas || !canvas.getContext) {
    alert('canvasに対応しているブラウザで開いてください');
    return false;
  }

  canvas.width = width;
  canvas.height = height;
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, ctx.width, ctx.height);

  ctx.font = "14px 'ＭＳ Ｐゴシック'";
  ctx.fillStyle = "black";
  ctx.strokeStyle="black";
  return ctx;
}


/*
 * 与えられたクラスタの高さの合計を求める関数
 * そのクラスタが終端であれば1を返す再帰関数
 */
/*
Clusters.prototype.getHeight = function (clust) {
  // 終端であれば高さは1を返す
  if (clust.left === null && clust.right === null) {
    return 1;
  }

  return this.getHeight(clust.left) + this.getHeight(clust.right)
}
*/
/*
 * ルートノードへの距離の合計を求める関数
 */
/*
Clusters.prototype.getDepth = function (clust) {
  // 終端への距離は0.0
  if (clust.left === null && clust.right === null) {
    return 0;
  }

  // 枝の距離は二つの方向の大きい方にそれ自身の距離を足す
  return Math.max(this.getDepth(clust.left), this.getDepth(clust.right)) + clust.distance
}
*/

/*
 * デンドログラムを描画
 */
/*Clusters.prototype.drawDendrogram = function (clust, labels, id) {
  var canvas = document.getElementById(id);
  if (!canvas || !canvas.getContext) {
    alert('canvasに対応しているブラウザで開いてください');
    return false;
  }

  var height = this.getHeight(clust) * 20;
  var width = 900;

  var ctx = canvas.getContext('2d');
  ctx.height = height;
  ctx.width = width;
  ctx.clearRect(0, 0, ctx.width, ctx.height);

  // 最初のノードを描く
  var scaling = (width - 150) / this.getDepth(clust);
  this.drawNode(ctx, clust, 10, (height/2), scaling, labels);
}
*/

/*
 * 子ノードたちの高さを受け取り、それらがあるべき場所を計算し、それに対して１本の長い垂直な直線と2本の水平な直線を描画する関数
 */
/*
Clusters.prototype.drawNode = function(ctx, clust, x, y, scaling, labels) {
  console.log("x: " + x);
  console.log("y: " + y);
  if (clust.id < 0) {
    var h1 = this.getHeight(clust.left) * 20;
    var h2 = this.getHeight(clust.right) * 20;
    var top = y - (h1 +h2) / 2;
    var bottom = y + (h1 + h2) / 2;

    var lineLength = clust.distance*scaling;

    ctx.lineWidth = 2;
    ctx.strokeStyle="black";

    // クラスタから子への垂直な直線
    ctx.beginPath();
    ctx.moveTo(x, top+h1/h2);
    ctx.lineTo(x, bottom-h2/2);
    ctx.stroke();

    // 左側のアイテムへの水平な直線
    ctx.beginPath();
    ctx.moveTo(x, top+h1/h2);
    ctx.lineTo(x+lineLength, top+h1/h2);
    ctx.stroke();

    // 右側のアイテムへの水平な直線
    ctx.beginPath();
    ctx.moveTo(x, bottom-h2/2);
    ctx.lineTo(x+lineLength, bottom-h2/2);
    ctx.stroke();

    // 左右のノードたちを描く関数を呼び出す
    this.drawNode(ctx, clust.left, x+lineLength, top+h1/2, scaling, labels);
    this.drawNode(ctx, clust.right, x+lineLength, bottom-h2/2, scaling, labels);

  } else {
    // 終点であればアイテムのラベルを描く
    ctx.font = "14px 'ＭＳ Ｐゴシック'";
    ctx.fillStyle = "black";
    console.log(x);
    console.log(y);
    //ctx.fillText(labels[clust.id], x+5, y-7);
  }
 }
*/
