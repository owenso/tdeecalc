var express = require('express'),
    morgan = require('morgan'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    path = require('path')

var connectionTest = require('./mfpConnectionTest')();

module.exports = function(){

    var app = express();

    if (process.env.NODE_ENV === 'local') {
        console.log('Running in local mode.');
        app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
       console.log("Running in production mode.");
       app.use(compress());
    }

    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use('/', express.static('public'));


    //routes
    require('../server/routes/mfp.api.routes.js')(app);
    require('../server/routes/bodytracking.api.routes.js')(app);


    app.get('*', function (req, res){
      res.sendFile(path.resolve('public', 'index.html'));
  });



    return app;
};
