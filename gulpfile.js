'use strict';

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    eslint = require('gulp-eslint'),
    project = require('./package.json');

var paths = {
  src: './' + project.name + '.js',
  dist: '.dist/' + project.name + '.js',
  raf: './bower_components/raf.js/raf.js',
  output: './dist'
}

gulp.task('lint', function() {
  return gulp.src(paths.src)
    .pipe(eslint())
    // outputs the lint results to the console. 
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on 
    // lint error, return the stream and pipe to failOnError last. 
    .pipe(eslint.failOnError());
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
