/**
 * Created by decipher on 24.2.16.
 */
var gzippo = require('gzippo');
var express = require('express');
var morgan = require('morgan');
var app = express();

app.use(morgan('dev'));
//app.use(gzippo.staticGzip("" + __dirname + "/dist"));
app.use(express.static(__dirname + "/dist"));

app.get('/', function(req, res) {

  // ejs render automatically looks in the views folder
  res.sendFile("index.html");
});

app.listen(process.env.PORT || 5000);
