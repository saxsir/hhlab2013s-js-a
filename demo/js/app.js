$(function () {
  var clusters = new Clusters();
  var blognames = [], words = [], data = [];

  var $readBtn = $('.read-btn');
  var $runBtn = $('.run-btn');

  // ファイルを選択した時に実行される関数
  $readBtn.change(function (e) {
    var file = e.target.files[0];
    clusters.readFile(file, function (result) {
      blognames = result[0];
      words = result[1];
      data = result[2];
      console.log('Finish reading file.');
    });
  });

  /*
   * 実行ボタンが押されたら実行される関数
   * ファイルが読み込まれていない場合は何もしない
   */ 
  $runBtn.click(function (e) {
    var id = e.target.id;
    if($readBtn.val() === '') {
      console.log('ファイルを読み込んでから実行して下さい');
      return;
    }
    switch(id) {
      case 'run-hcluster':
        console.log('Run hcluster');
        var clust = clusters.hcluster(data);
        console.log(clust);
        break;
      case 'run-draw2d':
        console.log("Run draw2d");
        break;
      default:
        console.log('Unknown case');
    }
  });
});
