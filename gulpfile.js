var gulp = require('gulp');
var jscs = require('gulp-jscs');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var del = require('del');

gulp.task('lint', function() {
  return gulp.src('./src/**/*.js')
    .pipe(jscs({
       esnext: true,
       preset: 'airbnb'
     }))
});

gulp.task('babel', function () {
  return gulp.src('./src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('sass', function () {
  gulp.src('./src/scss/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'));
});


gulp.task('watch', function() {
  gulp.watch(['./src/**/*.js'], ['lint', 'babel']);
  gulp.watch(['./src/scss/*.scss'], ['sass']);
  gulp.watch(['./src/index.html'], ['copy']);
});

gulp.task('copy', function () {
  gulp.src('./src/img/**/*')
    .pipe(gulp.dest('dist/img/'));

  gulp.src('./src/index.html')
    .pipe(gulp.dest('dist'));
});


gulp.task('default', [
  'watch',
  'lint',
  'babel',
  'sass',
  'copy'
  ]
);
