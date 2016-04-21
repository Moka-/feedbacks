'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        express: {
            options: {
                background: true,
                port: 9000,
                output: '.+'
            },
            dev: {
                options: {
                    script: 'app/app.js'
                }
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'app/scripts/**/*.js', 'server/**/*.js'],
            options: {
                jshintrc: true
            }
        },
        watch: {
            options: {
                livereload: true
            },
            express: {
                files: ['Gruntfile.js'],
                tasks: ['express:dev'],
                options: {
                    spawn: false
                }
            },
            public: {
                files: ["public/**/*.css", "public/**/*.js"]
            }
        }

    });

    grunt.loadNpmTasks('grunt-express-server');
    //grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    //grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    //grunt.loadNpmTasks('grunt-contrib-concat');
    //grunt.registerTask('test', ['jshint', 'qunit']);

    //grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);

    //grunt.registerTask('rebuild', [ 'browserify:scripts', 'stylus', 'copy:images']);
    grunt.registerTask('default', ['jshint' ,'express:dev', 'watch']);
    //grunt.registerTask('default', ['express:dev']);
};
