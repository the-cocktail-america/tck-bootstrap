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
    fs = require('fs'),
    onError = function (err) {
      console.log(err.toString());
      this.emit('end');
    },
    options = {
      "lint": true,
      "lint_bootstrap": false || (config.hasOwnProperty("bootstrap") && config.bootstrap.hasOwnProperty("lint") && config.bootstrap.lint === true)
    };

/**
 * Build layouts
 */
gulp.task('layouts', ['clean-layouts'], function() {
  gulp.start('generate-layouts');
});

/**
 * Build layouts without lint
 */
gulp.task('layouts-force', ['clean-layouts'], function() {
  options.lint = false;
  options.lint_bootstrap = false;
  gulp.start('generate-layouts');
});

/**
 * Clean layouts
 */
gulp.task('clean-layouts', function(callback) {
  del(config.path.build + '*.html', callback);
});

/**
 * Generate layouts
 */
gulp.task('generate-layouts', function() {
  console.log(options);
  var fileIssues = [];
  return gulp.src([config.path.html])
    .pipe(plugins.data(function(file) {
        return JSON.parse(fs.readFileSync(config.path.data, 'utf8'));
      })).on('error', onError)
    .pipe(plugins.nunjucks.compile()).on('error', onError)
    .pipe(gulpif(options.lint, plugins.htmlhint('.htmlhintrc')))
    .pipe(gulpif(options.lint, plugins.htmlhint.failReporter().on('error', onError)))
    .pipe(gulpif(options.lint_bootstrap, plugins.bootlint({
        stoponerror: true,
        stoponwarning: true,
        loglevel: 'debug',
        disabledIds: ['W009', 'E007'],
        issues: fileIssues,
        reportFn: function(file, lint, isError, isWarning, errorLocation) {
            var message = (isError) ? "ERROR! - " : "WARN! - ";
            if (errorLocation) {
                message += file.path + ' (line:' + (errorLocation.line + 1) + ', col:' + (errorLocation.column + 1) + ') [' + lint.id + '] ' + lint.message;
            } else {
                message += file.path + ': ' + lint.id + ' ' + lint.message;
            }
            console.log(message);
        },
        summaryReportFn: function(file, errorCount, warningCount) {
            if (errorCount > 0 || warningCount > 0) {
                console.log("please fix the " + errorCount + " errors and "+ warningCount + " warnings in " + file.path);
            } else {
                console.log("No problems found in "+ file.path);
            }
        }
      })))

    .pipe(plugins.prettify({ indent_char: ' ', indent_size: 2 }))
    .pipe(gulp.dest(config.path.build));
});
