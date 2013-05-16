// グローバル関数っぽいものの宣言
var clusters = new Clusters();
var blognames = [],
  words = [],
  data = [];

// ファイルを選択した時に実行される関数
$('#read-txt').change(function (e) {
  var file = e.target.files[0];
  clusters.readFile(file, function (result) {
    blognames = result[0];
    words = result[1];
    data = result[2];
    console.log('Finish reading file.');
  });
});

/*
 * 階層的クラスタリングの実行ボタンが押されたら実行される関数
 */
$('#run-hcluster').click(function (e) {
  console.log('Run hcluster');
  var clust = clusters.hcluster(data);
  console.log(clust);
});

/*
 * 多次元尺度構成法の実行ボタンが押されたら実行される関数
 */
$('#run-draw2d').click(function (e) {
  console.log("Run draw2d");
  var coords = clusters.scaleDown(data);
  clusters.draw2d(coords, blognames, 'main', 1000, 1000);
});

/*
 * Twitterで遊んでみるの実行ボタンが押されたら実行される関数
 */
$('#run-tcluster').click(function (e) {
  console.log('Run tcluster');
  var json = JSON.parse($('#parse-tw-result').val());
  var usernames = [],
    data = [];
  for (var i = 0, length = json.length; i < length; i++) {
    usernames.push(json[i].screenName);
    data.push(json[i].tweetTime);
  }
  console.log('Run draw2d');
  var coords = clusters.scaleDown(data);
  clusters.draw2d(coords, usernames, 'main', 1000, 1000);
});

/*
 * 
 */
$('#run-kcluster').click(function (e) {
  var kclust, cNum;
  var i, ilen;
  var json = JSON.parse($('#parse-json').val());
  var usernames = [],
    data = [];
  for (i = 0, ilen = json.length; i < ilen; i++) {
    usernames.push(json[i].screenName);
    data.push(json[i].tweetTime);
  }
  console.log('Run kcluster');

  cNum = $('#cNum').val();
  if (cNum === '') {
    cNum = undefined;
  } else {
    cNum = parseInt(cNum);
  }
  kclust = clusters.kcluster(data, undefined, cNum);
  //console.log(kclust);
  for (i = 0; i < kclust.length; i++) {
    console.log('<クラスター' + i + '>');
    for (j = 0; j < kclust[i].length; j++) {
      console.log(usernames[kclust[i][j]]);
    }
    console.log('');
  }
});


/*
 * アカウントのデータを解析ボタンが押されたら実行される関数
 */
$('#parse-tweet').click(function (e) {
  var username = $('#tw-username').val();
  
  var twitter = new Twitter();
  twitter.parse(username);

  // オーバーライド
  Twitter.prototype.callback = function (data) {
    var tUser = new TwitterUser();
    // ツイート時間を数える配列の初期化
    var ttc = [];
    for (var i = 0; i < 24; i++) {
      ttc[i] = 0;
    }

    // 全ツイートに対して処理
    for (var i = 0, length = data.length; i < length; i++) {
      // 日時データを要素分解
      var created_at = data[i].created_at.split(" ");
      // 投稿日時変換 "Mon Dec 01 14:24:26 +0000 2008" -> "Dec 01, 2008 14:24:26"
      var post_date = created_at[1] + " " + created_at[2] + ", " + created_at[5] + " " + created_at[3];
      // 日時データ処理
      var date = new Date(post_date); // 日付文字列 -> オブジェクト変換
      date.setHours(date.getHours() + 9); // UTC -> JST (+9時間)
      var hour = date.getHours(); // 時間取得

      // とりあえず時間単位で計測する
      ttc[hour]++;
    }
    tUser.userName = data[0].user.name;
    tUser.screenName = data[0].user.screen_name;
    tUser.tweetTime = ttc;
    var json = JSON.stringify(tUser);
/*
    if ($('#parse-tw-result').val()) {
      var str = $('#parse-tw-result').val().slice(0, -1);
      str += ',' + json + ']';
    } else {
      var str = '[' + json + ']';
    }
    */
    $('#parse-tw-result').val(json);
  }
});
