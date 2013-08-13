'use strict'

module.exports = function(grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'smoothscroll.js'
      ]
    },
    uglify: {
      core: {
        files: {
          'dist/smoothscroll.js': ['smoothscroll.js']
        }
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['bower_components/raf.js/raf.min.js', 'dist/smoothscroll.js'],
        dest: 'dist/smoothscroll.raf.js',
      }
    }
  });

  grunt.registerTask('default', [
    'jshint'
  ]);

  grunt.registerTask('build', [
    'jshint',
    'uglify:core',
    'concat'
  ]);
}


