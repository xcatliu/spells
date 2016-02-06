const gulp = require('gulp');
const rimraf = require('rimraf');


gulp.task('clean', ['clean:gh-pages', 'clean:lib']);

gulp.task('clean:gh-pages', (cb) => {
  rimraf('./gh-pages', cb);
});

gulp.task('clean:lib', (cb) => {
  rimraf('./lib', cb);
});
