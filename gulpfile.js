'use strict';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    project = require('./package.json');

var paths = {
  src: './src/' + project.title + '.js',
  output: './dist'
};

var banner = '/*' +
  '\n * ' + project.title + ' polyfill - v' + project.version +
  '\n * ' + project.homepage +
  '\n * ' + project.copyright + ' (c) ' + project.author.name + ', ' + project.contributors[0].name +
    ' - ' + project.license + ' License' +
  '\n */\n\n';

// lint task
gulp.task('lint', function() {
  return gulp.src(paths.src)
    .pipe($.eslint())
    // outputs the lint results to the console.
    .pipe($.eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failOnError last.
    .pipe($.eslint.failOnError());
});

// build task
gulp.task('build', [ 'lint' ], function() {
  return gulp.src([ paths.src ])
    .pipe($.concatUtil.header(banner))
    .pipe(gulp.dest(paths.output));
});

// assign default gulp task
gulp.task('default', [ 'build' ]);
