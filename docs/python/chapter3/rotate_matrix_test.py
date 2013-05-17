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
output_file_path = 'rotate_matrix.result.jpg'


# こっからメイン
blognames,words,data = clusters.read_file(input_file_path)

# 行と列を入れ替えてデンドログラム表示
rdata = clusters.rotate_matrix(data)
word_clust = clusters.hcluster(rdata)
clusters.draw_dendrogram(word_clust, labels=words, jpeg=output_file_path)



