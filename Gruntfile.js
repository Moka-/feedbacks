'use strict';
process.execArgv = [];
module.exports = function (grunt) {
    grunt.initConfig({
        express: {
            options: {
                port: 9000,
                breakOnFirstLine: true
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
                    'app/public/**/*.html',
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
                    'app/dal/**/*.js',
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
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['parallel:web']);
    //grunt.registerTask('default', ['express:dev']);
};
