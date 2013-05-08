/* ここでだけ使うUserクラス */
var TwitterUser = function () {}
TwitterUser.prototype.userName = '';
TwitterUser.prototype.screenName = '';
TwitterUser.prototype.tweetTimeCount = [];

var Twitter = function () {}
Twitter.prototype = {
        consumerKey: "EeqWTnX0daCeEFu3eGtg",
        consumerSecret: "UT1E0kzuWNlntDeWGsXWk5nMfQP93MJBKphVfjmi4",
        accessToken: "413861403-DjNoMVbhyCoCwCHEMGVrtIKRAAASdYNLEXkhTW6A",
        tokenSecret:    "tYZxpJyZMDYuNpi6j0WJc1BZUgO0NghVEbKXDElDg"
};

Twitter.prototype.get = function(api, content) {
    var accessor = {
        consumerSecret: this.consumerSecret,
        tokenSecret: this.tokenSecret
    };
 
    var message = {
        method: "GET",
        action: api,
        parameters: {
            oauth_version: "1.0",
            oauth_signature_method: "HMAC-SHA1",
            oauth_consumer_key: this.consumerKey,
            oauth_token: this.accessToken
        }
    };
    for (var key in content) {
        message.parameters[key] = content[key];
    }
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    var target = OAuth.addToURL(message.action, message.parameters);
 
    var options = {
        type: message.method,
        url: target,
        dataType: "jsonp",    //ここでjsonpを指定する
        jsonp: false,        //jQueryによるcallback関数名の埋め込みはしない
        cache: true            //リクエストパラメータに時刻を埋め込まない
    };
    $.ajax(options);
}

Twitter.prototype.callback = function (data) {
    console.log(data);
}

Twitter.prototype.parse = function (username) {
  //オプションとコールバック関数の指定
  var content = {
    count: "200",
    screen_name: username,
    callback: 'Twitter.prototype.callback'
  };

  //Twitter APIの呼び出し
  this.get("https://api.twitter.com/1.1/statuses/user_timeline.json", content)
}
