'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

var browserSync = require('browser-sync');

gulp.task('inject-reload', ['inject'], function() {
  browserSync.reload();
});

gulp.task('inject', ['scripts', 'styles'], function () {

  var injectLib = gulp.src([conf.paths.src + '/app/lib/**/*.js'], {read: false});
  var libOptions = {
    starttag: '<!-- inject:lib -->',
    ignorePath: [conf.paths.src, conf.paths.tmp + '/serve'],
    addRootSlash: false
  };

  var injectStyles = gulp.src([
    path.join(conf.paths.tmp, '/serve/app/**/*.css'),
    path.join('!' + conf.paths.tmp, '/serve/app/vendor.css')
  ], { read: false });

  var injectScripts = gulp.src([
    path.join(conf.paths.tmp, '/serve/app/**/*.module.js')
  ], { read: false });

  var injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };
  var replace = require('gulp-token-replace');
  var config = require(path.join('../', conf.paths.src, '/app/config.json'));
  return gulp.src(path.join(conf.paths.src, '/*.html'))
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe($.inject(injectLib, libOptions))
    .pipe(replace({global:config, preserveUnknownTokens: true}))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});
