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
    options = {
      "lint": true,
    };

/**
 * Build styles
 */
gulp.task('styles', ['clean-styles'], function() {
  gulp.start('generate-styles');
});

/**
 * Build styles without lint
 */
gulp.task('styles-force', ['clean-styles'], function() {
  options.lint = false;
  gulp.start('generate-styles');
});

/**
 * Clean styles
 */
gulp.task('clean-styles', function(callback) {
    del(config.path.build + 'css', callback);
});

/**
 *  Generate styles
 */
gulp.task('generate-styles', function() {
  return gulp.src([config.path.css])
    .pipe(gulpif(options.lint, plugins.sassLint({
        config: '.sass-lint.yml'
    })))
    .pipe(gulpif(options.lint, plugins.sassLint.format()))
    .pipe(gulpif(options.lint, plugins.sassLint.failOnError()))

    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass({outputStyle: 'expanded'})).on('error', plugins.sass.logError)
    .pipe(plugins.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(plugins.rename('tck_bootstrap.css'))
    .pipe(gulp.dest(config.path.build + 'css'))
    .pipe(plugins.cssnano())
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(plugins.rename({ extname: '.min.css' }))
    .pipe(gulp.dest(config.path.build + 'css'))
    .pipe(gulp.dest('source/docs/assets/css'));
});
