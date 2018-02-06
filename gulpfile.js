'use strict';

// ------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------

const config            = require('config/project.config.json');

const gulp              = require('gulp');
const less              = require('gulp-less');
const pixRem            = require('gulp-pixrem');
const combineMq         = require('gulp-combine-mq');
const cache             = require('gulp-cached');
const filter            = require('gulp-filter');
const notify            = require('gulp-notify');
const progeny           = require('gulp-progeny');
const autoPrefixer      = require('gulp-autoprefixer');
const cleanCss          = require('gulp-clean-css');
const rename            = require('gulp-rename');
const gulpConnect       = require('gulp-connect');
const gulpConnectSsi    = require('gulp-connect-ssi');
const mjml              = require('gulp-mjml');

// ------------------------------------------------------------------------------
// PATHS
// ------------------------------------------------------------------------------

const FLATBUILD_PATH    = `${__dirname}${config.paths.flatbuild}`;

// ------------------------------------------------------------------------------
// LESS WATCH AND COMPILATION
// ------------------------------------------------------------------------------

const LESS_PATH         = `${__dirname}${config.lang.less.path}`;
const CSS_PATH          = `${__dirname}${config.lang.less.dist}`;

gulp.task('less', function() {
    return gulp.src(LESS_PATH + '/**/*.less')
        .pipe(cache('less'))
        .pipe(progeny({
            regexp: /^\s*@import\s*(?:\(\w+\)\s*)?['"]([^'"]+)['"]/
        }))
        .pipe(filter(['**/*.less', '!**/_*.less']))
        .pipe(less()).on('error', notify.onError(function(err) {
            return 'Error compiling less: ' + err.message;
        }))
        .pipe(autoPrefixer({
            browsers: config.less.browsers
        }))
        .pipe(combineMq({
            beautify: false
        }))
        .pipe(cleanCss({
            keepSpecialComments: '0'
        }))
        .pipe(gulp.dest(CSS_PATH))
        .pipe(gulpConnect.reload());
});

gulp.task('watch:less', ['less'], function() {
    gulp.watch(LESS_PATH + '/**/*.less', ['less']);
});

// ------------------------------------------------------------------------------
// MJML COMPILATION
// ------------------------------------------------------------------------------

const MJML_PATH             = `${__dirname}${config.lang.mjml.path}`;
const MJML_COMPILED_PATH    = `${__dirname}${config.lang.mjml.dist}`;

gulp.task('mjml', function() {
    return gulp.src(MJML_PATH + '/**/*.mjml')
        .pipe(mjml())
        .pipe(gulp.dest(MJML_COMPILED_PATH));
});

gulp.task('watch:mjml', ['mjml'], function() {
    return gulp.watch([MJML_PATH + '/**/*.mjml'], ['mjml']);
});

// ------------------------------------------------------------------------------
// FLATBULD SERVER AND HTML WATCH
// ------------------------------------------------------------------------------

gulp.task('html', function () {
    gulp.src(FLATBUILD_PATH + '**/*.html')
        .pipe(gulpConnect.reload());
});

gulp.task('serve:flat', ['less'], function() {
    gulpConnect.server({
        root: FLATBUILD_PATH,
        port: 2500,
        livereload: true,
        middleware: function(){
            return [gulpConnectSsi({
                baseDir: FLATBUILD_PATH,
                ext: '.html',
                method: 'readLocal'
            })];
        }
    });
    gulp.watch(LESS_PATH + '/**/*.less', ['less']);
    gulp.watch(FLATBUILD_PATH + '/**/*.html', ['html']);
});

// ------------------------------------------------------------------------------
// DEFAULT TASK
// ------------------------------------------------------------------------------

gulp.task('default', ['watch:less']);