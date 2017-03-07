var gulp = require('gulp');
var runSequence = require('run-sequence');
var less = require('gulp-less');
var LessAutoprefix = require('less-plugin-autoprefix'),
    autoprefix = new LessAutoprefix({ browsers: ['last 4 versions'] });
var LessPluginCleanCSS = require('less-plugin-clean-css'),
    cleanCSSPlugin = new LessPluginCleanCSS({advanced: true});
var connect = require('gulp-connect');
var shell = require('gulp-shell');

gulp.task('jekyll', shell.task([
  'jekyll build',
]));

gulp.task('less', function () {
  return gulp.src(['./_less/styles.less'])
    .pipe(less({
      plugins: [autoprefix, cleanCSSPlugin]
    }))
    .pipe(gulp.dest('./css/'));
});

// gulp.task('fonts', function () {
//   return gulp.src([
//     './node_modules/benchmark-patterns/fonts/**/*'
//   ])
//     .pipe(gulp.dest('./fonts/'));
// });

gulp.task('server', function () {
  connect.server({
    root: './_site/',
    port: '7000',
    livereload: true
  });
});

gulp.task('reload', function () {
  return gulp.src('./_site/**/*.html')
    .pipe(connect.reload());
});

gulp.task('rebuild', function(callback) {
  runSequence('less',
              'jekyll',
              ['reload'],
              callback);
});

gulp.task('watch', function () {
  gulp.watch(['./*.html',
              './*.md',
              './_config.yml',
              './_includes/*.*',
              './_layouts/*.*',
              './_less/**/*.*',
              './_posts/**/*.*',
              './blog-images/**/*.*',
              './js/**/*.*'], ['rebuild']);
});


// Dev Mode

gulp.task('dev', function(callback) {
  runSequence(['less'],
              'jekyll',
              ['server', 'watch'],
              callback);
});
