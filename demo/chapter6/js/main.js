var $body = $('body');
var $result = $('#result');
var init = function() {
  $('#classifier-db').remove();
  changeClassFile('js/docclass.Classifier.js');
};
var addJsFile = function(filename, id) {
  var elem = $('<script>');
  elem.attr({
    src:  filename,
    id : id
  });
  $body.append(elem);
};
var changeClassFile = function(filename) {
  $('#classifier').remove();
  var elem = $('<script>');
  elem.attr({
    src:  filename,
    id : 'classifier'
  });
  $body.append(elem);
};
var changeSpecFile = function(filename) {
  $('#spec').remove();
  var elem = $('<script>');
  elem.attr({
    src:  filename,
    id : 'spec'
  });
  $body.append(elem);
};

// ここから下がイベント登録
$('#clear').click(function(e) {
  $result.val('');
});

// 6.3 分類器のトレーニングのテスト
$('#63test').click(function(e) {
  init();
  changeSpecFile('spec/6-3Spec.js');
});

// 6.4 確率を計算するのテスト
$('#64test').click(function(e) {
  init();
  changeSpecFile('spec/6-4Spec.js');
});

// 6.7 分類器を保存するのテスト
$('#67test').click(function(e) {
  init();
  addJsFile('js/docclass.Classifier.DB.js', 'classifier-db');
  changeSpecFile('spec/6-7Spec.js');
  $('.db-init').attr('disabled', false);
});

// DBの初期化
$('.db-init').click(function(e) {
  cl.db.transaction(
    function(tx) {
      tx.executeSql('DROP TABLE IF EXISTS fc;');
      tx.executeSql('DROP TABLE IF EXISTS cc;');
    },
    function(error) {
      onfailure(error, 'Error: initdb()');
    },
    function() {
      onsuccess('Success: initdb()');
      $('.db-init').attr('disabled', true);
    });
});

// 6.7.0 トレーニング終了後に計算するのテスト
$('#670test').click(function(e) {
  init();
  addJsFile('js/docclass.Classifier.DB.js', 'classifier-db');
  changeSpecFile('spec/6-7Spec.plus.js');
  $('.db-init').attr('disabled', false);
});



