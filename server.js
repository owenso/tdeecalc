process.env.NODE_ENV = process.env.NODE_ENV || 'local';

const express = require('./config/express');

const app = express();

const port = process.env.PORT || 3000;


app.listen(port);

console.log('Server running at port:' + port);
