# coding:utf-8
from PIL import Image, ImageDraw, ImageFont
from math import sqrt
import random

"""
データファイルを読み込む関数
"""
def read_file(filename):
  lines = [line for line in file(filename)]

  # 最初の行は列のタイトル（単語）
  colnames = lines[0].strip().split('\t')[1:]
  rownames = []
  data = []

  for line in lines[1:]:
    p = line.strip().split('\t')
    # それぞれの行の最初の列は名前
    rownames.append(p[0])
    # 行の残りの部分がその行のデータ
    data.append([float(x) for x in p[1:]])

  return rownames, colnames, data

"""
数字のリストを2つ受け取り、その2つの相関スコア（ピアソン相関係数）を返す
"""
def pearson(v1, v2):
  # 単純な合計
  sum1 = sum(v1)
  sum2 = sum(v2)

  # 平方の合計
  sum1Sq = sum([pow(v,2) for v in v1])
  sum2Sq = sum([pow(v,2) for v in v2])

  # 積の合計
  pSum = sum([v1[i] * v2[i] for i in range(len(v1))])

  # ピアソンによるスコアを算出
  num = pSum - (sum1 * sum2 / len(v1))
  den = sqrt( (sum1Sq - pow(sum1,2) / len(v1)) * (sum2Sq - pow(sum2, 2) / len(v1)) )
  if den == 0 :
    return 0

  return 1.0 - num/den

"""
木構造をつくるために必要なプロパティを持つクラス
"""
class bicluster:
  def __init__(self, vec, left = None, right = None, distance = 0.0, id = None):
    self.left = left
    self.right = right
    self.vec = vec
    self.id = id
    self.distance = distance

"""

"""
def hcluster(rows, distance=pearson):
  distances = {}
  current_clust_id = -1

  # クラスタは最初は行たち
  clust = [bicluster(rows[i], id = i) for i in range(len(rows))]

  while len(clust) > 1:
    lowest_pair = (0, 1)
    closest = distance(clust[0].vec, clust[1].vec)

    # すべての組をループし、もっとも距離の近い組を探す
    for i in range(len(clust)):
      for j in range(i+1, len(clust)):
        # 距離をキャッシュしてあればそれを使う
        if(clust[i].id, clust[j].id) not in distances:
          distances[(clust[i].id, clust[j].id)] = distance(clust[i].vec, clust[j].vec)

        d = distances[(clust[i].id, clust[j].id)]

        if d<closest:
          closest = d
          lowest_pair = (i, j)

    # 二つのクラスタの平均を計算する
    merge_vec = [(clust[lowest_pair[0]].vec[i] + clust[lowest_pair[1]].vec[1]) / 2.0 for i in range(len(clust[0].vec))]

    # 新たなクラスタをつくる
    new_cluster = bicluster(merge_vec, left=clust[lowest_pair[0]], right=clust[lowest_pair[1]], distance=closest, id=current_clust_id)

    # 元のセットではないクラスタのIDは負にする
    current_clust_id -= 1
    del clust[lowest_pair[1]]
    del clust[lowest_pair[0]]
    clust.append(new_cluster)

  return clust[0]

"""
結果を見るための関数
"""
def print_clust(clust, labels=None, n=0):
  # 階層型のレイアウトにするためにインデントする
  for i in range(n): print ' ',
  if clust.id<0:
    # 負のidはこれが枝であることを示している
    print '-'
  else:
    # 正のidはこれが終端だということを示している
    if labels == None: print clust.id
    else: print labels[clust.id]

  # 右と左の枝を表示する
  if clust.left != None: print_clust(clust.left, labels=labels, n=n+1)
  if clust.right != None: print_clust(clust.right, labels=labels, n=n+1)

"""
"""
def get_height(clust):
  # 終端であれば高さは1にする
  if clust.left == None and clust.right == None: return 1

  # そうでなければ高さはそれぞれの枝の高さの合計
  return get_height(clust.left) + get_height(clust.right)

def get_depth(clust):
  # 終端への距離は0.0
  if clust.left == None and clust.right == None: return 0

  # 枝の距離は二つの方向の大きい方にそれ自身の距離を足したもの
  return max(get_depth(clust.left), get_depth(clust.right)) + clust.distance

def draw_dendrogram(clust, labels, jpeg='clusters.jpg'):
  # 高さと幅
  h = get_height(clust) * 20
  w = 1200
  depth = get_depth(clust)

  # 幅は固定されているので、適宜縮尺
  scaling = float(w-150) / depth

  # 白を背景とする新しい画像を生成
  img = Image.new('RGB', (w, h), (255, 255, 255))
  draw = ImageDraw.Draw(img)
  draw.line((0, h/2, 10, h/2), fill=(255, 0, 0))

  # 最初のノードを描く
  draw_node(draw, clust, 10, (h/2), scaling, labels)
  img.save(jpeg, 'JPEG')

def draw_node(draw, clust, x, y, scaling, labels):
  # とりあえず日本語も英語も共通フォント
  font = ImageFont.truetype('/Library/Fonts/Hiragino Sans GB W3.otf', 12, encoding='unic')
  if clust.id < 0:
    h1 = get_height(clust.left) * 20
    h2 = get_height(clust.right) * 20
    top = y - (h1 + h2) / 2
    bottom = y + (h1 + h2) / 2

    # 直線の長さ
    ll = clust.distance*scaling

    # クラスタから子への垂直な直線
    draw.line((x, top+h1/2, x, bottom-h2/2), fill=(255, 0, 0))

    # 左側のアイテムへの水平な直線
    draw.line((x, top+h1/2, x+ll, top+h1/2), fill=(255, 0, 0))

    # 右側のアイテムへの水平な直線
    draw.line((x, bottom-h2/2, x+ll, bottom-h2/2), fill=(255, 0, 0))

    # 左右のノードたちを描く関数を呼び出す
    draw_node(draw, clust.left, x+ll, top+h1/2, scaling, labels)
    draw_node(draw, clust.right, x+ll, bottom-h2/2, scaling, labels)

  else:
    # 終点であればアイテムのラベルを描く（日本語対策のため、1回unicodeに変換してから描画する）
    draw.text((x+5, y-7), unicode(labels[clust.id], 'utf-8'), font=font, fill=(0, 0,0))


# 行と列の入れ替え
def rotate_matrix(data):
  new_data = []
  for i in range(len(data[0])):
    new_row = [data[j][i] for j in range(len(data))]
    new_data.append(new_row)

  return new_data


# k-means
def kcluster(rows, distance=pearson, k=4):
  # それぞれのポイントの最小値と最大値を決める
  ranges = [(min([row[i] for row in rows]), max([row[i] for row in rows])) for i in range(len(rows[0]))]

  # 重心をランダムにk個配置する
  clusters = [[random.random() * (ranges[i][1] - ranges[i][0]) + ranges[i][0] for i in range(len(rows[0]))] for j in range(k)]

  last_matches = None

  for t in range(100):
    print 'Iteration %d' % t
    best_matches = [[] for i in range(k)]

    # それぞれの行に対して、最も近い重心を探し出す
    for j in range(len(rows)):
      row = rows[j]
      best_match = 0
      for i in range(k):
        d = distance(clusters[i], row)
        if d < distance(clusters[best_match], row): best_match = i
      best_matches[best_match].append(j)

    # 結果が前回と同じであれば完了
    if best_matches == last_matches: break
    last_matches = best_matches

    # 重心をそのメンバーの平均に移動する
    for i in range(k):
      avgs = [0.0] * len(rows[0])
      if len(best_matches[i]) > 0:
        for row_id in best_matches[i]:
          for m in range(len(rows[row_id])):
            avgs[m] += rows[row_id][m]
        for j in range(len(avgs)):
          avgs[j] /= len(best_matches[i])
        clusters[i] = avgs
  return best_matches

# Tanimoto係数
def tanimoto(v1, v2):
  c1, c2, shr = 0, 0, 0
  for i in range(len(v1)):
    if v1[i] != 0: c1 += 1
    if v2[i] != 0: c2 += 1
    if v1[i] != 0 and v2[i] != 0: shr += 1

  return 1.0 - (float(shr)/(c1+c2-shr))

# 距離を表す
def scale_down(data, distance=pearson, rate=0.01):
  n = len(data)

  # アイテムのすべての組の実際の距離
  real_dist = [[distance(data[i], data[j]) for j in range(n)] for i in range(0, n)]
  outer_sum = 0.0

  # 2次元上にランダムに配置するように初期化する
  loc = [[random.random(), random.random()] for i in range(n)]
  fake_dist = [[0.0 for j in range(n)] for i in range(n)]

  last_error = None
  for m in range(0, 1000):
    # 予測距離を計る
    for i in range(n):
      for j in range(n):
        fake_dist[i][j] = sqrt(sum([pow(loc[i][x] - loc[j][x], 2) for x in range(len(loc[i]))]))

    # ポイントの移動
    grad = [[0.0, 0.0] for i in range(n)]

    total_error = 0
    for k in range(n):
      for j in range(n):
        if j == k: continue

        # 誤差は距離の差の百分率
        error_term = (fake_dist[j][k] - real_dist[j][k]) / real_dist[j][k]

        # 他のポイントへの誤差に比例してそれぞれのポイントを近づけたり遠ざけたりする必要がある
        grad[k][0] += ((loc[k][0] - loc[j][0]) / fake_dist[j][k]) * error_term
        grad[k][1] += ((loc[k][1] - loc[j][1]) / fake_dist[j][k]) * error_term

        # 誤差の合計を記録
        total_error += abs(error_term)
    print total_error

    # ポイントを移動することで誤差が悪化したら終了
    if last_error and last_error < total_error: break
    last_error = total_error

    # 学習率と傾斜を掛けあわせてそれぞれのポイントを移動
    for k in range(n):
      loc[k][0] -= rate*grad[k][0]
      loc[k][1] -= rate*grad[k][1]

  return loc

def draw2d(data, labels, jpeg="mds2d.jpg"):
  # とりあえず日本語も英語も共通フォント
  font = ImageFont.truetype('/Library/Fonts/Hiragino Sans GB W3.otf', 12, encoding='unic')
  img = Image.new('RGB', (2000, 2000), (255, 255, 255))
  draw = ImageDraw.Draw(img)

  for i in range(len(data)):
    x = (data[i][0] + 0.5) * 1000
    y = (data[i][1] + 0.5) * 1000
    draw.text((x, y), unicode(labels[i], 'utf-8'), font=font, fill=(0, 0,0))

  img.save(jpeg, 'JPEG')
