# coding:utf-8
import feedparser
import re
import lib.yahoo_splitter as splitter
import sys

argvs = sys.argv
argc = len(argvs)

# 引数がなければ使い方を表示してプログラムを終了する。
if (argc < 2):
  print 'Usage: # python %s path_to_feedlist.txt' % argvs[0]
  quit()

input_file_path = argvs[1]
output_file_path = 'blogdata.txt'

# 日本語対応（入力ファイルの名前にjpが入ってたら日本語環境で実行する）
if input_file_path.find('jp') >= 0:
  lang = 'ja'
else:
  lang = 'en'

# 実行環境を出力
print '#####################'
print 'input_file_path: %s' % input_file_path
print 'output_file_path: %s' % output_file_path
print 'language: %s' % lang
print '#####################\n'

# RSSフィードのタイトルと、単語の頻度のディクショナリを返す
def get_word_counts(url):
  # フィードをパースする
  d = feedparser.parse(url)
  wc = {}

  # すべてのエントリをループする
  for e in d.entries:
    if 'summary' in e: summary = e.summary
    else: summary = e.description

    # 単語のリストを取り出す
    words = get_words(e.title + ' ' + summary)
    for word in words:
      wc.setdefault(word, 0)
      wc[word] += 1

  return d.feed.title, wc

# 日本語に対応
def get_words(html):
  # すべてのhtmlタグを取り除く
  txt = re.compile(r'<[^>]+>').sub('', html)

  if lang == 'ja':
    return [word.lower() for word in splitter.split(txt) if word != '']

  # すべての非アルファベット文字で分割する
  words = re.compile(r'[^A-Z^a-z]+').split(txt)

  # 小文字に変換する
  return [word.lower() for word in words if word != '']

"""
フィード全体をループしてデータセットを生成、それぞれのブログのそれぞれの単語の数を数える
同時に、それぞれの単語が出現するブログの数も数える
"""
ap_count = {}
word_counts = {}
feed_list = [line for line in file(input_file_path)]
feed_num = 1
for feed_url in feed_list:
  try:
    title, wc = get_word_counts(feed_url)
    word_counts[title] = wc
    for word, count in wc.items():
      ap_count.setdefault(word, 0)
      if count > 1:
        ap_count[word] += 1
    print '%d: Success to parse feed %s' % (feed_num, feed_url)
  except:
    print '%d: Failed to parse feed %s' % (feed_num, feed_url)
  feed_num += 1

"""
単語の出現数のリストを生成
その際に単語の出現率に上限と下限の閾値を設定する（でたらめな単語やtheなどの頻出単語を弾くため）
"""
word_list = []
for w, bc, in ap_count.items():
  frac = float(bc) / len(feed_list)
  if frac > 0.1 and frac < 0.5:
    word_list.append(w)

"""
単語のリストとブログのリストから、それぞれのブログ中での
すべてのタンゴの出現数の表が記載されたテキストファイルを生成する
"""
out = file(output_file_path, 'w')
out.write('Blog')
for word in word_list:
  out.write('\t%s' % word.encode('utf-8'))
out.write('\n')

for blog, wc in word_counts.items():
  out.write(blog.encode('utf-8'))
  for word in word_list:
    if word in wc:
      out.write('\t%d' % wc[word])
    else:
      out.write('\t0')
  out.write('\n')

print '######'
print 'Create %s' % output_file_path
print '######'
