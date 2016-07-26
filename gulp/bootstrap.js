'use strict';

var gulp = require('gulp'),
    del = require('del'),
    plugins = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'gulp.*'],
        replaceString: /^gulp(-|\.)/,
        lazy: false
    }),
    config = require('./config/config.json');

gulp.task('clean-styles', function(callback) {
    del(config.path.build + 'css', callback);
});

gulp.task('sass-bootstrap', function() {
  return gulp.src([config.path.css])
    .pipe(plugins.sassLint({
        config: '.sass-lint.yml'
    }))
    .pipe(plugins.sassLint.format())
    .pipe(plugins.sassLint.failOnError())

    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass({outputStyle: 'expanded'})).on('error', plugins.sass.logError)
    .pipe(plugins.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(plugins.rename('styles.css'))
    .pipe(gulp.dest(config.path.build + 'css'))
    .pipe(plugins.cssnano())
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(plugins.rename({ extname: '.min.css' }))
    .pipe(gulp.dest(src.build + 'css'));
});
