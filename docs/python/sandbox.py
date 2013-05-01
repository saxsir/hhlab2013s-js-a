# coding:utf-8
import lib.clusters as clusters
import sys

# 色々試して遊ぶ用

# blognames,words,data = clusters.read_file(input_file_path)
# clust = clusters.hcluster(data)

# ふつうにプリント
# clusters.print_clust(clust, labels=blognames)

# デンドログラム表示
# clusters.draw_dendrogram(clust, blognames, jpeg=output_file_path)

# 行と列を入れ替えてデンドログラム表示
# rdata = clusters.rotate_matrix(data)
# word_clust = clusters.hcluster(rdata)
# clusters.draw_dendrogram(word_clust, labels=words, jpeg=output_file_path)

# k-meansでクラスタリング
# kclust = clusters.kcluster(data, k=10)
# [blognames[r] for r in kclust[0]]
