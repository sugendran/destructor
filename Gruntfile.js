module.exports = function (grunt) {
  "use strict";

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.initConfig({
    requirejs: {
      compile: {
        options: {
          name: "../node_modules/almond/almond",
          include: ['index.js'],
          baseUrl: "./src/",
          mainConfigFile: "./src/requirejs_config.js",
          out: "js/main.js"
        }
      }
    },
    watch: {
      js: {
        files: 'src/**/*.js',
        tasks: ['requirejs']
      }
    }
  });

};