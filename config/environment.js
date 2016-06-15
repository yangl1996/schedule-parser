module.exports = function(app, express){
  app.use(express.static(__dirname + '/../static')); // public static files
  app.set('views', __dirname + '/../views'); // template directory
  app.set('view engine', 'pug'); // template engine
  app.locals.pretty = true;
  if (app.get('env') === 'development') {
  }
};
