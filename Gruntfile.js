module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['target', 'dist', 'tmp'],
        exec: {
            npmpack: 'npm pack dist',
            publish: 'npm publish dist'
        },
        requirejs: {
            prod: {
                options: {
                    baseUrl: 'src',
                    optimize: 'uglify2',
                    removeCombined: true,
                    dir: 'target',
                    modules: [
                        {
                            name: 'dm/parser'
                        },
                        {
                            name: 'dm/Channel',
                            include:['dm/Model']
                        }
                    ]
                }
            }
        },
        copy: {
            prod: {
                files: [
                    {expand: true, cwd: './', src: ['package.json', 'bower.json', 'README.md'], dest: 'dist'},
                    {expand: true, cwd: './target', src: ['./**'], dest: 'dist/prod'},
                    {expand: true, cwd: './node_modules/requirejs', src: ['./require.js'], dest: 'dist/prod/dm'},
                    {expand: true, cwd: './src', src: ['./**'], dest: 'dist/dev'},
                    {expand: true, cwd: './node_modules/requirejs', src: ['./require.js'], dest: 'dist/dev/dm'}

                ]
            }
        },
        docco: {
            debug: {
                src: ['src/**/*.js'],
                options: {
                    output: 'dist/docs/'
                }
            }
        },
        bump: {
            options: {
                files: ['package.json', 'bower.json', 'dist/package.json', 'dist/bower.json'],
                commit: true,
                commitFiles: ['package.json', 'bower.json', 'dist/*'],
                createTag: true,
                tagName: '%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin'
            }
        },
        mocha_require_phantom: {
            options: {
                base: 'test',
                main: 'test-bootstrap',
                requireLib: '../node_modules/requirejs/require.js',
                files: ['./modelTest.js']
            },
            target: {}
        },
        mochaTest: {
            options: {
                reporter: 'spec',
                captureFile: 'target/results.txt', // Optionally capture the reporter output to a file
                quiet: false, // Optionally suppress output to standard out (defaults to false)
                clearRequireCache: true // Optionally clear the require cache before running tests (defaults to false)
            },
            test: {
                src: ['test/modelTest.js']
            }
        },
        connect: {
            options: {
                keepalive: true
            },
            base: {
                hostname: "*",
                port: "8000",
                target: 'http://localhost:8000/',
                open: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-require-phantom');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-docco');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('test', ['mocha_require_phantom', 'mochaTest']);
    grunt.registerTask('default', ['clean', 'requirejs', 'copy', 'docco']);
    grunt.registerTask('publish', ['default', 'bump', 'exec:publish']);

};