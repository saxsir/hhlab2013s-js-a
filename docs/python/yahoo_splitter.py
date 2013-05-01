# coding:utf-8
from urllib import urlopen, quote_plus
from bs4 import BeautifulSoup


app_id = 'dj0zaiZpPVhRaE9UNzBtWUkwRiZkPVlXazlTRWR2WjFsck5HTW1jR285TUEtLSZzPWNvbnN1bWVyc2VjcmV0Jng9ZmE-'
page_url = 'http://jlp.yahooapis.jp/MAService/V1/parse'

# 形態素解析した結果をリストで返す
def split(sentence, appid = app_id, results = 'ma', filter = '1|2|4|5|9|10'):
  ret = []
  sentence = quote_plus(sentence.encode('utf-8'))
  query = "%s?appid=%s&results=%s&uniq_filter=%s&sentence=%s" % (page_url, app_id, results, filter, sentence)

  soup = BeautifulSoup(urlopen(query))
  try:
    return [l.surface.string for l in soup.ma_result.word_list]
  except:
    return []
