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
    }
  });

  grunt.registerTask('default', [
    'jshint'
  ]);
}


