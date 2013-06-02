var docclass = new DocClass();
var cl = new docclass.Classifier(docclass.getwords);

// データベース接続
cl.setdb('classify_training', function() {
  // サンプルデータを学習
  docclass.sampletrain(cl, function(){
    // console.log('Success: sampletrain()');
    $('#result').val('Success: sampletrain()');
  });
});

