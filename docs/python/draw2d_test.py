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
output_file_path = 'draw2d.result.jpg'


# こっからメイン
blognames,words,data = clusters.read_file(input_file_path)
coords = clusters.scale_down(data)
clusters.draw2d(coords, blognames, jpeg=output_file_path)

