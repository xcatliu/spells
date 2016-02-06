/* eslint no-console:0, no-use-before-define:0, no-var:0 */

const gulp = require('gulp');

/* default */
gulp.task('default', ['build:site:watch', 'serve']);
gulp.task('prepublish', ['clean:lib', 'build:lib']);
gulp.task('deploy', ['build:site', 'deploy:gh-pages']);

/* clean */
gulp.task('clean:lib', () => {
  const rimraf = require('rimraf');
  rimraf.sync('./lib');
});

gulp.task('clean:gh-pages', () => {
  const rimraf = require('rimraf');
  rimraf.sync('./gh-pages');
});

/* build lib */
gulp.task('build:lib', ['clean:lib', 'build:lib:json', 'build:lib:babel']);

gulp.task('build:lib:json', () => {
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
  'build:site:CNAME',
  'build:site:json',
  'build:site:sass',
  'build:site:index',
  'build:site:spells',
]);

gulp.task('build:site:watch', ['build:site'], () => {
  gulp.watch('./src/**/*.json', ['build:site:json']);
  gulp.watch('./site/**/*.html', ['build:site:index', 'build:site:spells']);
  gulp.watch('./site/sass/**', ['build:site:sass']);
});

gulp.task('build:site:json', () => {
  gulp.src('./src/**/*.json').pipe(gulp.dest('./gh-pages'));
});

gulp.task('build:site:CNAME', () => {
  gulp.src('./site/CNAME').pipe(gulp.dest('./gh-pages'));
});

gulp.task('build:site:sass', () => {
  const sass = require('gulp-sass');

  gulp.src('./site/sass/index.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./gh-pages/assets'));
});

gulp.task('build:site:index', () => {
  const swig = require('gulp-swig');
  const data = normalizeData(require('./lib'));

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
  const data = normalizeData(require('./lib'));
  const rename = require('gulp-rename');

  data.spells.forEach((spell, index) => {
    gulp.src('./site/spell.html')
      .pipe(swig({
        data: Object.assign({}, data, { spell }),
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

/* deploy:gh-pages */
gulp.task('deploy:gh-pages', (cb) => {
  const exec = require('child_process').exec;
  const cmd = [
    'rm -rf .deploy',
    'git clone git@github.com:xcatliu/spells.git .deploy',
    'cd .deploy',
    'git checkout gh-pages',
    'rsync -a ../gh-pages/ ./',
    'git add :',
    'git commit -m "Update gh-pages"',
    'git push origin gh-pages',
    'cd ..',
    'rm -rf .deploy',
  ].join(' && ');
  exec(cmd, (error, stdout, stderr) => {
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    if (error !== null) {
      console.log(`exec error: ${error}`);
      return cb(error);
    }
    cb();
  });
});

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

function normalizeData(data) {
  const result = Object.assign({}, data);
  result.spells = data.spells.map((spell) => {
    const name = numberToString(spell.hue);
    return Object.assign({}, spell, {
      spell_json: '/spells/' + name + '.json',
      spell_html: '/spells/' + name + '.html',
      type_name: data.spell_types[spell.type].name,
      effects: spell.effects.map((effect) => {
        return Object.assign({}, effect, {
          effect_type_name: data.effect_types[effect.effect_type].name,
        });
      }),
    });
  });
  return result;
}
