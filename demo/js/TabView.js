// タブをつかったレイアウトを管理する
var TabView = function (selector) {
  this.setTablinks(selector);
};

// selector以下のaタグをすべて認識して、タブを生成
// また、1番最初のものを選択する
TabView.prototype.setTablinks = function (selector) {
  var self = this;
  var $links = $('a', $(selector));

  this.tabs = [];

  $links.each(function () {
    self.addTab(this);
  });

  this.selectTab();
};

// 管理するタブを追加
TabView.prototype.addTab = function (link) {
  var tab = new Tab(link);
  tab.tabview = this;
  this.tabs.push(tab);
};

// 引数で指定したタブを選択 (1つだけ表示)
// 指定されない場合(最初の読み込み時)はハッシュから選択
TabView.prototype.selectTab = function (tab) {
  var self = this;

  this.tabs.forEach(function (t) {
    t.hide();
  });

  if (!tab) {
    if (location.hash) {
      this.tabs.forEach(function (t) {
        if ($(t.$link).attr('href') == location.hash) {
          tab = t;
        }
      });
    } else {
      tab = this.tabs[0];
    }
  }

  // とりあえず表示させて、無理だったら最初のタブを表示
  try {
    tab.show();
  } catch (e) {
    tab = this.tabs[0];
    tab.show();
  }
};

// タブの挙動を管理するクラス
var Tab = function (link) {
  var self = this;

  this.$link = $(link);
  this.$content = $(this.$link.attr('href'));

  // このタブが指示するハッシュ
  this.hash = $(self.$link).attr('href');

  $(this.$link).click(function (e) {
    e.preventDefault();
    self.tabview.selectTab(self);
    // 履歴に追加
    history.pushState(null, null, self.hash);
  });

  $(window).on('popstate', function(e) {
    self.tabview.tabs.forEach(function (t) {
      // URLで指示されたハッシュとタブのハッシュが等しいとき
      if (self.hash == location.hash) {
        self.prev = t;
      }
    });
    self.tabview.selectTab(self.prev);
    delete self.prev;
  });
};

// タブを非表示
Tab.prototype.hide = function () {
  this.$link.removeClass('active');
  this.$content.hide();
};

// タブを表示
Tab.prototype.show = function () {
  this.$link.addClass('active');
  this.$content.show();
};
