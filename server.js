/**
 * Created by decipher on 24.2.16.
 */
var gzippo = require('gzippo');
var express = require('express');
var morgan = require('morgan');
var app = express();

app.use(morgan('dev'));
//app.use(gzippo.staticGzip("" + __dirname + "/dist"));
app.use(express.static(__dirname + + "/dist"));
app.listen(process.env.PORT || 5000);
