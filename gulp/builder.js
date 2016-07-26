'use strict';

var gulp = require('gulp'),
    config = require('./config/config.json'),
    del = require('del'),
    plugins = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'gulp.*'],
        replaceString: /^gulp(-|\.)/,
        lazy: false
    }),
    moment = require('moment'),
    build = generateBuild();

function generateBuild() {
  var date = new Date;
  return moment().format('YYYYMMDDHHmmss');
}

gulp.task('sizereport', function () {
  return gulp.src(config.path.build + '**/*')
    .pipe(plugins.sizereport({
      gzip: true
    }));
});

gulp.task('build', function (cb) {
  return plugins.gutil.log(pkg.version + ' ' + build);
});
