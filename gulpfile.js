/* eslint no-console:0 */

const gulp = require('gulp');

/* clean */
gulp.task('clean', ['clean:gh-pages', 'clean:lib']);

gulp.task('clean:gh-pages', () => {
  const rimraf = require('rimraf');
  rimraf.sync('./gh-pages');
});

gulp.task('clean:lib', () => {
  const rimraf = require('rimraf');
  rimraf.sync('./lib');
});

/* build lib */
gulp.task('build:lib', ['clean:lib', 'build:lib:copy', 'build:lib:babel']);

gulp.task('build:lib:copy', () => {
  gulp.src('./src/**/*.json')
    .pipe(gulp.dest('./lib'));
});

gulp.task('build:lib:babel', () => {
  const babel = require('gulp-babel');
  gulp.src('./src/index.js')
    .pipe(babel())
    .pipe(gulp.dest('./lib'));
});

/* build site */
gulp.task('build:site', [
  'clean:gh-pages',
  'build:site:copy',
  'build:site:sass',
  'build:site:index',
]);

gulp.task('build:site:copy', () => {
  gulp.src('./src/**/*.json').pipe(gulp.dest('./gh-pages'));
});

gulp.task('build:site:sass', () => {
  const sass = require('gulp-sass');

  gulp.src('./site/sass/index.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./gh-pages/assets'));
});

gulp.task('build:site:index', () => {
  const swig = require('gulp-swig');
  const data = require('./lib');

  gulp.src('./site/index.html')
    .pipe(swig({ data }))
    .pipe(gulp.dest('./gh-pages'));
});

/* serve */
gulp.task('serve', () => {
  const http = require('http');
  const ecstatic = require('ecstatic');

  http.createServer(
    ecstatic({
      root: __dirname + '/gh-pages',
      cache: 0,
      showDir: true,
    })
  ).listen(8080);

  console.log('ecstatic serving gh-pages at http://0.0.0.0:8080');
});

gulp.task('prepublish', ['clean:lib', 'build:lib']);
