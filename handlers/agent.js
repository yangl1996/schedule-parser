exports.fetch_captcha = fetch_captcha;
exports.handle_login_form = handle_login_form;

var request = require('request');

/* header used to get dean.pku.edu.cn page */
var trivial_header = {
  'host': 'dean.pku.edu.cn',
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:28.0) Gecko/20100101  Firefox/28.0',
  'accept-language': 'zh-cn',
  'accept-encoding': 'gzip, deflate',
  'connection': 'keep-alive'
};

/* header used to post to dean backend */
var post_header = {
  'host': 'dean.pku.edu.cn',
  'content-type': 'application/x-www-form-urlencoded',
  'origin': 'http://dean.pku.edu.cn',
  //'content-length': '0',
  'connection': 'keep-alive',
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:28.0) Gecko/20100101  Firefox/28.0',
  'referer': 'http://dean.pku.edu.cn/student/index.html',
  'accept-language': 'zh-cn',
  'accept-encoding': 'gzip, deflate'
}

function fetch_captcha(req, res) {
  request({
    uri: 'http://dean.pku.edu.cn/student/yanzheng.php?act=init',
    headers: trivial_header,
  }).pipe(res);
};

function handle_login_form(req, res) {
  fake_header = post_header;
  fake_header['cookie'] = req.get('cookie');  // pass the cookie to make captcha work
  user_id = req.body.inputID;
  user_password = req.body.inputPassword;
  user_captcha = req.body.inputCaptcha;
  login_status = 0;  // 0 for unknown error, 1 for success, 2 for wrong identity, 3 for wrong captcha
  request.post({
    uri: 'http://dean.pku.edu.cn/student/authenticate.php',
    form: {
      'sno': user_id,
      'password': user_password,
      'captcha': user_captcha,
      'submit': '%B5%C7%C2%BC'
    },
    headers: fake_header
  }, function (error, response, body) {
    // check status
    if (body.indexOf('图形校验码错误，请重新登录') > -1) {
      login_status = 3;
    }
    else if (body.indexOf('学号不存在，或者密码有误') > -1) {
      login_status = 2;
    }
    else if (body.indexOf('student_index.php?PHPSESSID=') > -1) {
      login_status = 1;
    }
    console.log(login_status);
  });
}
