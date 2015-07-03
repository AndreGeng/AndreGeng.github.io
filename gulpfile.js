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

gulp.task('default', ['styles', 'wiredep'], function(){
  var sources = gulp.src(['./javascripts/**/*.js', './stylesheets/*.css'], {read: false});
  return gulp.src('./index.html')
          .pipe($.inject(sources, {addRootSlash:false}))
          .pipe(gulp.dest('.'));
});

gulp.task('watch', ['styles'] ,function () {
  gulp.watch('stylesheets/*.scss', ['default']);
  gulp.watch('javascripts/**/*.js', ['default']);
  gulp.watch('bower.json', ['default']);
});

gulp.task('buildposts', function(){
  return gulp.src('posts/**/*.md')
          .pipe($.debug({title: 'DEBUG:'}))
          .pipe($.markdown())
          .pipe(gulp.dest('digested_posts'));
});
function handleError(err) {
  console.error(err.toString());
  this.emit('end');
}