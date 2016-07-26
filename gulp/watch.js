'use strict';

var gulp = require('gulp'),
    config = require('./config/config.json');

gulp.task('watch', function() {
  gulp.watch(config.path.tmpl, ['layout']);
  gulp.watch(config.path.data, ['layout']);
  gulp.watch(config.path.scss, ['sass']);
});
