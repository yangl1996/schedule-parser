# Class Schedule Parser for Peking University

Automatically downloads your class schedule from [dean.pku.edu.cn](http://dean.pku.edu.cn)
and parses it into an `.ics` file.

__Currently I cannot implement a native webapp. PKU Dean uses Cookie to identify sessions,
but Cookies are disabled by default in XHR CORS. Although `withCredential` can be set to
`true` for Cookies to work, it requires the server to send `Access-Control-Allow-Credential`,
which is not the case for PKU Dean.__

## Getting Started

__tl;dr: Navigate to [cp.yangl1996.com](https://cp.yangl1996.com) and enjoy.__


```
npm install
```

You may also manually download bootstrap and jQuery and place the code under
`static/jquery` and `static/bootstrap`.

Then just open `index.html` with your browser or host it with a static HTTP server.
If you don't want to hassle with command line tools or web servers, you may use the
instance I host on [cp.yangl1996.com](https://cp.yangl1996.com).

## Security

This app is fully native, which means that it does not communicate with any server other
than [dean.pku.edu.cn](http://dean.pku.edu.cn). So you can audit the code yourself and
be 100% confident of what the app does. After all it runs totally in your browser and
you see all code getting executed.
