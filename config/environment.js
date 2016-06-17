module.exports = function(app, express){
  var bodyParser = require('body-parser');
  app.use(express.static(__dirname + '/../static')); // public static files
  app.use(bodyParser.urlencoded({ extended: true })); // parsing forms
  app.set('views', __dirname + '/../views'); // template directory
  app.set('view engine', 'pug'); // template engine
  app.locals.pretty = true;
  if (app.get('env') === 'development') {
  }
};
