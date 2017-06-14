function update_captcha(){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState==4 && xhr.status==200) {
      var blob = new Blob([xhr.response], {
        type: xhr.getResponseHeader("Content-Type")
      });
      var img_url = window.URL.createObjectURL(blob);
      document.getElementById("dean-captcha").src = img_url;
    }
  }
  xhr.responseType = "arraybuffer";
  xhr.withCredentials = true; /* to let the browser to honor the cookie */
  /* https://stackoverflow.com/questions/12840410/how-to-get-a-cookie-from-an-ajax-response */
  /* Server needs to set Access-Control-Allow-Credential to true. */
  xhr.open("GET", "http://dean.pku.edu.cn/student/yanzheng.php?act=init&rand="+Math.random(), true);
  xhr.send();
}