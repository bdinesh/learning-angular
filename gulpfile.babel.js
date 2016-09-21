'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
//const browserify = require('browserify');
//const babelify = require('babelify');
//const source = require('vinyl-source-stream');
const concat = require('gulp-concat');
const eslint = require('gulp-eslint');
const del = require('del');
const templateCache = require('gulp-angular-templatecache');
const htmlmin = require('gulp-htmlmin');
const gulpif = require('gulp-if');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const wrap = require('gulp-wrap');
const yargs = require('yargs');
//const child = require('child_process');
const path = require('path');
const historyApiFallback = require('connect-history-api-fallback');

const argv = yargs.argv;
//const exec = child.exec;
const root = 'src';

const config = {
    port: 1000,
    devBaseUrl: 'http://localhost',
    paths: {
        dist: './dist/',
        mainJs: `${root}/app/main/app.module.js`,
        templates: `${root}/app/**/*.html`,
        scripts: [
            `${root}/app/**/*.js`,
            `!${root}/app/**/*.spec.js`
        ],
        tests: `${root}/app/**/*.spec.js`,
        vendorScripts: [
            'angular/angular.js',
            'angular-cookies/angular-cookies.js',
            'angular-resource/angular-resource.js',
            'angular-aria/angular-aria.js',
            'angular-animate/angular-animate.js',
            'angular-material/angular-material.js',
            'angular-messages/angular-messages.js',
            'angular-ui-router/release/angular-ui-router.js',
            'angular-material-data-table/dist/md-data-table.js',
            'angular-material-data-table/dist/md-data-table-directory.js',
            'angular-loading-bar/build/loading-bar.js',
            'oidc-client/dist/oidc-client.js',
            'ngstorage/ngStorage.js'
        ],
        styles: [
            `${root}/sass/**/*.{scss,css}`
        ],
        vendorStyles: [
            'angular-material/angular-material.css',
            'angular-loading-bar/build/loading-bar.css',
            'angular-material-data-table/dist/md-data-table.css'
        ],
        static: [
            `${root}/index.html`,
            `${root}/fonts/**/*`,
            `${root}/img/**/*`,
            `${root}/data/**/*`
        ]
    }
};

gulp.task('serve', () => {
    browserSync.init({
        files: [`${config.paths.dist}/**`],
        server: {
            baseDir: 'dist',
            index: 'index.html',
            middleware: [historyApiFallback()]
        },
        port: config.port
    });
});

gulp.task('reloadBrowser', () => {
    browserSync.reload();
});

gulp.task('templates', () => {
    gulp.src(config.paths.templates)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(templateCache({
            root: 'app',
            standalone: true,
            transformUrl: function (url) {
                return url.replace(path.dirname(url), '.');
            }
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('vendorScripts', ['templates'], () => {
    return gulp.src(config.paths.vendorScripts.map(item => 'node_modules/' + item))
        .pipe(concat('vendor.js'))
        .pipe(gulpif(argv.deploy, uglify()))
        .pipe(gulp.dest(config.paths.dist + 'js/'));
});

gulp.task('vendorStyles', () => {
    return gulp.src(config.paths.vendorStyles.map(item => 'node_modules/' + item))
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(config.paths.dist + 'css/'));
});

gulp.task('styles', ['vendorStyles'], () => {
    return gulp.src(config.paths.styles)
        .pipe(gulpif(argv.deploy, sourcemaps.init()))
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(gulpif(argv.deploy, sourcemaps.write()))
        .pipe(gulp.dest(config.paths.dist + 'css/'));
});

gulp.task('scripts', ['vendorScripts'], () => {
    return gulp.src([
        `!${root}/app/**/*.spec.js`,
        `${root}/app/**/*.module.js`,
        ...config.paths.scripts,
        './templates.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(wrap('(function(angular){\n\'use strict\';\n<%= contents %>})(window.angular);'))
        .pipe(babel())
        .pipe(concat('bundle.js'))
        //.pipe(ngAnnotate())
        .pipe(gulpif(argv.deploy, uglify()))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.paths.dist + 'js/'));
});

gulp.task('watch', ['serve', 'scripts'], () => {
    gulp.watch([config.paths.scripts, config.paths.templates], ['scripts']);
    gulp.watch(config.paths.styles, ['styles']);
    //gulp.watch(config.paths.static, ['reloadBrowser']);
});

gulp.task('lint', () => {
    return gulp.src(config.paths.scripts)
        .pipe(eslint({
            config: '.eslintrc'
        }))
        .pipe(eslint.format());
});

gulp.task('clean', cb => {
    return del([
        config.paths.dist + '**/*'
    ], cb);
});

gulp.task('copy', ['clean'], () => {
    return gulp.src(config.paths.static, { base: 'src' })
        .pipe(gulp.dest(config.paths.dist));
});

gulp.task('default', [
    'copy',
    'styles',
    'serve',
    'watch'
]);

gulp.task('production', [
    'copy',
    'styles',
    'scripts'
]);