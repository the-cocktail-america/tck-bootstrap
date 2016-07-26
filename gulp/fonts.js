'use strict';

var gulp = require('gulp'),
    del = require('del'),
    plugins = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'gulp.*'],
        replaceString: /^gulp(-|\.)/,
        lazy: false
    }),
    config = require('./config/config.json');

/**
 * Copy fonts
 */
gulp.task('fonts', ['clean-fonts'], function() {
  gulp.start('generate-fonts');
});

/**
 * Clean fonts
 */
gulp.task('clean-fonts', function(callback) {
    del(config.path.build + 'fonts/', callback);
});

/**
 * Generate fonts
 */
gulp.task('generate-fonts', function(){
  gulp.src([config.path.fonts])
    .pipe(plugins.plumber())
    .pipe(gulp.dest(config.path.build + 'fonts/'));
});
