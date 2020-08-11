const gulp = require('gulp');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const csso = require('gulp-csso');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const gulpIf = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const svgSymbols = require('gulp-svg-symbols');
const svgmin = require('gulp-svgmin');
const rename = require('gulp-rename');
const del = require('del');
const tinypng = require('gulp-tinypng-nokey');
const bro = require('gulp-bro');
const babelify = require('babelify');
const uglify = require('gulp-uglify');
const panini = require('panini');
const htmlmin = require('gulp-htmlmin');
const isDevelopment = process.env.NODE_ENV !== 'production';

gulp.task('views', function() {
    panini.refresh();

    return gulp.src('./src/pages/**/*.{hbs,html}')
        .pipe(panini({
            root: './src/pages',
            layouts: './src/layouts',
            partials: './src/components'
        }))
        .pipe(rename({ extname: '.html' }))
        .pipe(gulpIf(!isDevelopment, htmlmin({
            collapseWhitespace: true,
            minifyJS: true
        })))
        .pipe(gulp.dest('./public'));
});

gulp.task('styles', function () {
    return gulp.src('./src/app.scss')
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpIf(!isDevelopment, postcss([
            autoprefixer({
                browsers: ['> 5%', 'ff > 14']
            })
        ])))
        .pipe(gulpIf(isDevelopment, sourcemaps.write()))
        .pipe(gulpIf(!isDevelopment, csso()))
        .pipe(rename('style.css'))
        .pipe(gulp.dest('./public/css'))
});

gulp.task('scripts', function () {
  return gulp.src('./src/app.js')
    .pipe(bro({
      debug: isDevelopment,
      transform: [
        babelify.configure({ presets: ['es2015'] }),
      ]
    }))
    .pipe(gulpIf(!isDevelopment, uglify()))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('./public/js'));
});

gulp.task('fonts', function () {
  return gulp.src([
    './src/assets/fonts/**/*.*',
    './node_modules/font-awesome/fonts/**/*.*'
  ])
    .pipe(gulp.dest('./public/fonts'));
});

gulp.task('images', function () {
  return gulp.src(['./src/assets/images/**/*.*', '!./src/assets/images/svg/*.*'])
    .pipe(gulpIf(!isDevelopment, tinypng()))
    .pipe(gulp.dest('./public/images'));
});

gulp.task('svgSymbols', function () {
  return gulp.src('./src/assets/images/svg/**/*.svg')
    .pipe(svgmin())
    .pipe(svgSymbols({
      templates: ['default-svg'],
      class: '.icon_%f'
    }))
    .pipe(gulp.dest('./public'));
});

gulp.task('misc', function () {
  return gulp.src('./src/assets/misc/**/*.*')
    .pipe(gulp.dest('./public'));
});

gulp.task('watch', function () {
    gulp.watch('./src/**/*.{hbs,html}', gulp.series('views'));
    gulp.watch('./src/**/*.js', gulp.series('scripts'));
    gulp.watch('./src/**/*.{css,scss}', gulp.series('styles'));
    gulp.watch('./src/assets/images/**/*.*', gulp.series('images'));
    gulp.watch('./src/assets/images/svg/**/*.svg', gulp.series('svgSymbols'));
});

gulp.task('serve', function () {
  browserSync.init({
    server: './public',
    port: 8080
  });

  browserSync.watch('./public/**/*.*').on('change', browserSync.reload);
});

gulp.task('clean', function () {
  return del('./public')
});

gulp.task('build', gulp.series(
  'clean',
  'svgSymbols',
  gulp.parallel(
    'views',
    'styles',
    'scripts',
    'fonts',
    'images',
    'misc'
  )));

gulp.task('default', gulp.series(
  'build',
  gulp.parallel(
    'watch',
    'serve'
  )));
