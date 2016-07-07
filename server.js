process.env.NODE_ENV = process.env.NODE_ENV || 'local';

// var postgres = require('./config/postgres');
var express = require('./config/express');


var app = express();

var port = process.env.PORT || 3000;


app.listen(port);

console.log('Server running at port:' + port);
