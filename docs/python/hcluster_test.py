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
output_file_path = 'hcluster_test.result.jpg'


# こっからメイン
blognames,words,data = clusters.read_file(input_file_path)
clust = clusters.hcluster(data)

# デンドログラム作成
clusters.draw_dendrogram(clust, blognames, jpeg=output_file_path)

