var request = require('request')

module.exports = function(app) {
  /* display homepage */
  app.get('/', function(req, res) {
    res.render('index');
  });

  /* fetch captcha and send to client */
  app.get('/dean-captcha', function(req, res) {
    request({
      uri: 'http://dean.pku.edu.cn/student/yanzheng.php?act=init',
      headers: {
        'host': 'dean.pku.edu.cn',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:28.0) Gecko/20100101  Firefox/28.0',
        'accept-language': 'zh-cn',
        'accept-encoding': 'gzip, deflate',
        'connection': 'keep-alive'
      }
    }).pipe(res);
  });

};
