/* eslint no-console:0, no-use-before-define:0, no-var:0 */

const gulp = require('gulp');

/* default */
gulp.task('default', ['build:site:watch', 'serve']);

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
  'build:site:spells',
]);

gulp.task('build:site:watch', ['build:site'], () => {
  gulp.watch('./src/**/*.json', ['build:site:copy']);
  gulp.watch('./site/**/*.html', ['build:site:index', 'build:site:spells']);
  gulp.watch('./site/sass/**', ['build:site:sass']);
});

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
    .pipe(swig({
      data,
      defaults: {
        cache: false,
      },
    }))
    .pipe(gulp.dest('./gh-pages'));
});

gulp.task('build:site:spells', () => {
  const swig = require('gulp-swig');
  const data = require('./lib');
  const rename = require('gulp-rename');

  data.spells.forEach((spell, index) => {
    gulp.src('./site/spell.html')
      .pipe(swig({
        data: Object.assign({}, data, { hue: index }),
        defaults: {
          cache: false,
        },
      }))
      .pipe(rename(numberToString(index) + '.html'))
      .pipe(gulp.dest('./gh-pages/spells'));
  });
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

/* util */
gulp.task('generate_spells', () => {
  var i;
  const fs = require('fs');
  const path = require('path');
  for (i = 0; i < 360; i++) {
    if (i === 0) continue;
    if (i === 60) continue;
    if (i === 120) continue;
    if (i === 180) continue;
    if (i === 240) continue;
    if (i === 300) continue;
    const obj = {
      hue: i,
      color: 'hsl(' + i + ', 100%, 50%)',
      name: '?',
      icon: 'fa-question',
      description: 'Balabala...',
      type: 0,
      cost: 999,
      cooldown: 0,
      effects: [],
    };
    fs.writeFileSync(
      path.resolve(__dirname, 'src/spells', numberToString(i) + '.json'),
      JSON.stringify(obj, null, 2) + '\n', 'utf-8'
    );
  }

});

function numberToString(num) {
  if (num < 10) return '00' + num;
  if (num < 100) return '0' + num;
  return num;
}
