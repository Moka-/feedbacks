'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        express: {
            options: {
                background: true,
                fallback: function(){},
                port: 9000,
                output: '.+'
            },
            dev: {
                options: {
                    script: 'server/server.js'
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['app/**/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        qunit: {
            files: ['test/**/*.html']
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
                files: ['**/*.js'],
                tasks: ['express:dev'],
                options: {
                    spawn: false
                }
            },
            less: {
                files: ["public/**/*.less"],
                tasks: ["less"],
                options: {
                    livereload: false
                }
            },
            public: {
                files: ["public/**/*.css", "public/**/*.js"]
            }
        }

    });

    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    //grunt.registerTask('test', ['jshint', 'qunit']);
    //retarded comment just to commit suicide 
    //grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);

    //grunt.registerTask('rebuild', [ 'browserify:scripts', 'stylus', 'copy:images']);
    grunt.registerTask('default', ['jshint' ,'express:dev', 'watch']);
};
