var docclass = new DocClass();
var cl = new docclass.Classifier(docclass.getwords);

var $resultArea = $('#result');
// データベース接続
cl.setdb('classify_training', function() {
  // サンプルデータを学習
  docclass.sampletrain(cl, function() {
    // console.log('Success: sampletrain()');
    $resultArea.val('Success: sampletrain()\n\n');
    // 確率を計算
    cl.fprob('quick', 'good', function(res) {
      // console.log("cl.fprob('quick', 'good'): " + res);
      $resultArea.val($resultArea.val() + "cl.fprob('quick', 'good'): " + res + '\n\n');
    });
    // 1回学習後の重み付き確率を計算
    cl.weightedprob('money', 'good', cl.fprob, undefined, undefined, function(res) {
      // console.log("cl.weightedprob('money', 'good', cl.fprob,): " + res);
      $resultArea.val($resultArea.val() + "cl.weightedprob('money', 'good', cl.fprob,): " + res + '\n\n');
      // サンプルデータを学習
      docclass.sampletrain(cl, function() {
        // console.log('Success: sampletrain()');
        $resultArea.val($resultArea.val() + 'Success: sampletrain()\n\n');
        // 2回学習後の重み付き確率を計算する
        cl.weightedprob('money', 'good', cl.fprob, undefined, undefined, function(res) {
          $resultArea.val($resultArea.val() + "cl.weightedprob('money', 'good', cl.fprob,): " + res + '\n\n');
          // console.log("cl.weightedprob('money', 'good', cl.fprob,): " + res);
        });
      });
    });
  });
});

