var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var $ = require('gulp-load-plugins')();
var es = require('event-stream');

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
  var sourcesJs = gulp.src(['./javascripts/**/*.js']).pipe($.angularFilesort()).pipe($.debug({title: 'DEBUG:'}));
  var sourcesCss = gulp.src(['./stylesheets/*.css'], {read: false}).pipe($.debug({title: 'DEBUG:'}));
  return gulp.src('./index.html')
          .pipe($.inject(es.merge(sourcesJs, sourcesCss), {addRootSlash:false}))
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