var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var $ = require('gulp-load-plugins')();

gulp.task('styles', function(){
  return gulp.src('./stylesheets/*.scss')
          .pipe($.sass().on('error', handleError))
          .pipe(gulp.dest('./stylesheets'));
});

gulp.task('wiredep', function(){
  return gulp.src('./index.html')
          .pipe(wiredep())
          .pipe(gulp.dest('.'));
});

gulp.task('scripts', ['styles', 'wiredep'], function(){
  var sources = gulp.src(['./javascripts/*.js', './stylesheets/*.css'], {read: false});
  return gulp.src('./index.html')
          .pipe($.inject(sources, {addRootSlash:false}))
          .pipe(gulp.dest('.'));
});

gulp.task('watch', ['styles'] ,function () {
  gulp.watch('stylesheets/*.scss', ['styles']);
  gulp.watch('javascripts/*.js', ['scripts']);
  gulp.watch('bower.json', ['wiredep']);
});

function handleError(err) {
  console.error(err.toString());
  this.emit('end');
}