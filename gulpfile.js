(function() {
  'use strict';

  var gulp = require('gulp'),
      jscs = require('gulp-jscs'),
      jshint = require('gulp-jshint'),
      uglify = require('gulp-uglify'),
      concat = require('gulp-concat'),
      project = require('./package.json');

  var paths = {
    src: './' + project.name + '.js',
    dist: '.dist/' + project.name + '.js',
    raf: './bower_components/raf.js/raf.js',
    output: './dist'
  }

  gulp.task('lint', function() {
    return gulp.src(paths.src)
      .pipe(jscs())
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'));
  });

  gulp.task('uglify', [ 'lint' ], function() {
    return gulp.src(paths.src)
      .pipe(uglify())
      .pipe(gulp.dest(paths.output));
  });

  // build: generates uglified version
  // and add raf version file
  gulp.task('build', [ 'uglify' ], function() {
    return gulp.src([ paths.raf, paths.src ])
      .pipe(concat(project.name + '.raf.js'))
      .pipe(uglify())
      .pipe(gulp.dest(paths.output));
  });

  // assign default gulp task
  gulp.task('default', [ 'build' ]);
})();
