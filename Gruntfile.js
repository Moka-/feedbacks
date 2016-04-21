'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        express: {
            options: {
                // Override defaults here
                port: 9000
            },
            web: {
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
            frontend: {
                options: {
                    livereload: true
                },
                files: [
                    'app/public/styles/**/*.css',
                    'app/views/**/*.html',
                    'app/public/scripts/**/*.js',
                    'app/public/images/**/*'
                ],
                tasks: ['jshint']
            },
            web: {
                options: {
                    nospawn: true, // Without this option specified express won't be reloaded
                    atBegin: true,
                },
                files: [
                    'app/routes/**/*.js',
                    'app/app.js',
                    'Gruntfile.js',
                ],
                tasks: [ 'express:web' ]
            }
        },
        parallel: {
            web: {
                options: {
                    stream: true
                },
                tasks: [{
                    grunt: true,
                    args: ['watch:frontend']
                }, {
                    grunt: true,
                    args: ['watch:web'] // Also starts the express.js server
                }]
            },
        }
    });

    grunt.loadNpmTasks('grunt-parallel');
    grunt.loadNpmTasks('grunt-express-server');
    //grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    //grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    //grunt.loadNpmTasks('grunt-contrib-concat');
    //grunt.registerTask('test', ['jshint', 'qunit']);

    //grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);

    //grunt.registerTask('rebuild', [ 'browserify:scripts', 'stylus', 'copy:images']);
    grunt.registerTask('default', ['parallel:web']);
    //grunt.registerTask('default', ['express:dev']);
};
