/**
 * Created by decipher on 24.2.16.
 */
var gzippo = require('gzippo');
var express = require('express');
var morgan = require('morgan');
var app = express();

app.use(morgan('dev'));
//2 weeks: 1209600000 ms
app.use(express.static(__dirname + '/dist', {maxAge: 1209600000, clientMaxAge: 1209600000}));

app.get('/*', function(req, res){
  res.sendfile('./dist/index.html');
});

var server = app.listen(process.env.PORT || 80);
