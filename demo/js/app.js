$(function () {
  var clusters = new Clusters();
  var blognames, words, data;

  var $readBtn = $('#read-btn');
  var $runHCluster = $('#run-hcluster');

  // ファイルを選択した時に実行される関数
  $readBtn.change(function (e) {
    var file = e.target.files[0];
    clusters.readFile(file, function (result) {
      blognames = result[0];
      words = result[1];
      data = result[2];
      console.log('Finish reading file.');
      // クラスタリング実行ボタンを有効化する
      $runHCluster.removeAttr("disabled");
    });
  });

  // 実行ボタンが押されたら実行される関数
  $runHCluster.click(function () {
    // 二度押ししないように無効にしとく
    $runHCluster.attr("disabled", "disabled");
    var clust = clusters.hcluster(data);
    console.dir(clust);
  });
});
