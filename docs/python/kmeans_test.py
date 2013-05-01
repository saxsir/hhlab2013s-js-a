# coding:utf-8
import lib.clusters as clusters
import sys

argvs = sys.argv
argc = len(argvs)

# 引数がなければ使い方を表示してプログラムを終了する。
if (argc < 2):
  print 'Usage: # python %s path_to_blogdata.txt' % argvs[0]
  quit()

input_file_path = argvs[1]
output_file_path = 'kmeans_test.result.jpg'


# こっからメイン
blognames,words,data = clusters.read_file(input_file_path)

# k-meansでクラスタリング
kclust = clusters.kcluster(data, k=10)
print [[blognames[r] for r in kclust[i]] for i in range(len(kclust))]
