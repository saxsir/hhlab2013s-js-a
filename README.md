# hhlab2013s-js-a

hhlab2013年度, 春学期4限 JavaScript#A班のコード共有用のリポジトリです。

## メッセージ
* JSもPythonも適当に放り込んでいきます。
* 先学期のTabView.jsが良いなぁと思ったので拝借しました。[https://github.com/fnobi/hhlab-mylanguage](https://github.com/fnobi/hhlab-mylanguage)

## pythonコードの実行方法
※ 必要なpythonのライブラリは怒られたら自分で入れて（個人環境によりけりでimportするパスが違うかも..）

## RSSフィードからすべての単語を取り出す
    # Usage: python generate_feed_parser.py path_to_feedlist.txt
    $ python generate_feed_parser.py ../../data/feedlist/feedlist.origin.txt

→ blogdata.txtが作成される

## 階層的クラスタリング（凝集法）+ 見にくいけどコンソールに結果出力
    # Usage: python print_hcluster_test.py path_to_blogdata.txt
    $ python print_hcluster_test.py ../../data/blogdata/blogdata.origin.txt

→ コンソールに結果が出るだけ

## 階層的クラスタリング（凝集法）+ デンドログラム作成
    # Usage: python hcluster_test.py path_to_blogdata.txt
    $ python hcluster_test.py ../../data/blogdata/blogdata.origin.txt

→ hcluster_test.result.jpgが作成される

## K平均法
    # Usage: python hcluster_test.py path_to_blogdata.txt
    $ python hcluster_test.py ../../data/blogdata/blogdata.origin.txt

→ kmeans_test.result.jpgが作成される

※ クラスタの数(k)はソースを直接いじる

## 列と行を入れ替えて階層的クラスタリング + デンドログラム作成
    # Usage: python rotate_matrix_test.py path_to_blogdata.txt
    $ python rotate_matrix_test.py ../../data/blogdata/blogdata.origin.txt

→ rotate_matrix_test.result.jpgが作成される

※ かなり時間かかる

## Tanimoto係数で距離をだしてみる
    # Usage: python tanimoto_test.py path_to_zebo.txt
    $ python tanimoto_test.py ../../data/zebo/zebo.txt

→ tanimoto_test.result.jpgが作成される

## 多次元尺度構成法とやらでデータセットを2次元に表示
    # Usage: python draw2d_test.py path_to_blogdata.txt
    $ python draw2d_test.py ../../data/blogdata/blogdata.origin.txt

→ draw2d.result.jpgが作成される
