/**
 * Created by decipher on 24.2.16.
 */
var gzippo = require('gzippo');
var express = require('express');
var morgan = require('morgan');
var app = express();

app.use(morgan('dev'));
app.use(express.static(__dirname + '/dist'));

app.get('/*', function(req, res){
  res.sendfile('./dist/index.html');
});

var server = app.listen(process.env.PORT || 80);
