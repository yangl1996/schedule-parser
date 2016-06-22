var express = require('express');
var app = express();

/* Load configurations and routes */
require('./config/environment.js')(app, express);
require('./config/routes.js')(app);

/* Start the app */
app.listen(process.env.CLASS_PARSER_PORT || 3000, function() {
    console.log('Server started.');
});
