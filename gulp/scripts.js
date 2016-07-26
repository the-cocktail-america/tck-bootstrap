'use strict';

var gulp = require('gulp'),
    del = require('del'),
    gulpif = require('gulp-if'),
    plugins = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'gulp.*'],
        replaceString: /^gulp(-|\.)/,
        lazy: false
    }),
    config = require('./config/config.json'),
    scripts = require('./config/scripts.json'),
    options = {
      "lint": true,
    };

scripts.plugins.push(config.path.js);

/**
 * Build scripts
 */
gulp.task('scripts', ['clean-scripts'], function() {
  gulp.start('generate-scripts');
});

/**
 * Build scripts without lint
 */
gulp.task('scripts-force', ['clean-scripts'], function() {
  options.lint = false;
  gulp.start('generate-scripts');
});

/**
 * Clean scripts
 */
gulp.task('clean-scripts', function(callback) {
    del(config.path.build + 'js', callback);
});

/**
 * Generate scripts
 */
gulp.task('generate-scripts', function() {
    return gulp.src(scripts.plugins)
    .pipe(gulpif(options.lint, plugins.jscsCustom({configPath: './jscs.json'})))
    .pipe(gulpif(options.lint, plugins.jshint()))
    .pipe(gulpif(options.lint, plugins.jshint.reporter('jshint-stylish')))
    .pipe(plugins.concat('scripts.js'))
    .pipe(gulp.dest(config.path.build + 'js'))
    .pipe(plugins.uglify())
    .pipe(plugins.rename({ extname: '.min.js' }))
    .pipe(gulp.dest(config.path.build + 'js'));
});
