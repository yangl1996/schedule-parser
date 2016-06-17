# Dean Authentication Method

[Peking University dean website](http://dean.pku.edu.cn) is using an obsolete authentication method. Sessions are identified by a cookie '`PHPSESSID`' which is as a matter of fact a random string. User identity is transmitted in clear text due to lack of HTTPS support.

## Authentication Process

### Start Session

A session is started by making a `GET` request to `http://dean.pku.edu.cn/student/yanzheng.php?act=init` which generates a `.gif` CAPTCHA image. When responding to the request, `/student/yanzheng.php` will place a cookie `PHPSESSID` in user's browser to identify this session and validate CAPTCHA. This cookie must be included in all later actions to enable the server to know the user's identity.

To simulate this process, simply do a `GET` request and you get a pair of CAPTCHA image and `PHPSESSID` value (in the cookie). Store them.

### Logging in

When authenticating a login prompt, the server needs these four values:

* Student ID
* Password
* `PHPSESSID`
* CAPTCHA

For ID, password and CAPTCHA, simply post it in `application/x-www-form-urlencoded` format to endpoint `http://dean.pku.edu.cn/student/authenticate.php` as a form:

```js
request.post({
  uri: 'http://dean.pku.edu.cn/student/authenticate.php',
  form: {
    'sno': user_id,
    'password': user_password,
    'captcha': user_captcha,
    'submit': '%B5%C7%C2%BC'
  },
  headers: fake_header
});
```

Note that we add a magic key-value pair `'submit': '%B5%C7%C2%BC'`.

For `PHPSESSID`, just include it as a cookie in the HTTP request header. What also must be included in the header is `origin`, `referer` and a valid `user-agent` string. Just use the following header and you'll be fine:

```js
var fake_header = {
  'host': 'dean.pku.edu.cn',
  'content-type': 'application/x-www-form-urlencoded',
  'origin': 'http://dean.pku.edu.cn',
  //'content-length': '',  Calculated according to your post body size
  //'cookie': '',  Use the one you get when requesting CAPTCHA image
  'connection': 'keep-alive',
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:28.0) Gecko/20100101  Firefox/28.0',
  'referer': 'http://dean.pku.edu.cn/student/index.html',
  'accept-language': 'zh-cn',
  'accept-encoding': 'gzip, deflate'
}
```

### Check Result

`/student/authenticate.php` uses a fairly ugly way to notify the browser whether the authentication succeeded or failed. There are three return values.

You can't rely on status code since it returns `200` on any situation.

#### Wrong CAPTCHA

The authentication server always checks CAPTCHA first. So even if ID, password and CAPTCHA are all wrong, it will just return "wrong CAPTCHA".

Response body is some javascript displaying a alert on the page:

```html
<html>
  <title>
    <link rel="stylesheet" type="text/css" href="dean.css">
  </title>
  <body>
    <script Language ="JavaScript">
      alert("图形校验码错误，请重新登录");window.location.href="index.html"
    </script>
  </body>
</html>
```

#### Wrong User identity

Returned when password and ID don't match or the ID doesn't exist.

```html
<html>
  <body>
    <script Language ="JavaScript">
      alert("学号不存在，或者密码有误。-1");window.location.href="index.html"
    </script>
  </body>
</html>
```

#### Success

When authentication succeeded, the authentication server ties your identity to the `PHPSESSID` it assigned to you earlier. Then you use this `PHPSESSID` to access all the protected resource.

For security reason, always logout after you get everything done, as `PHPSESSID` is the only thing others need to continue a not-timed-out session.

The server will return a javascript redirecting the browser to a URL containing your `PHPSESSID`. Or you can make up it by yourself.

```html
<html>
  <body>
    <script Language ="JavaScript">
      parent.location.href="student_index.php?PHPSESSID=11111222222333333333344444444555"
    </script>
  </body>
</html>
```
