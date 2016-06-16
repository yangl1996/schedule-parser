var agent = require('../handlers/agent');

module.exports = function(app) {
  /* display homepage */
  app.get('/', function(req, res) {
    res.render('index');
  });

  /* fetch captcha and send to client */
  app.get('/dean-captcha', agent.fetch_captcha);
};
