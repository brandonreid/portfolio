var gulp = require('gulp');
var runSequence = require('run-sequence');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
var connect = require('gulp-connect');
var shell = require('gulp-shell');

gulp.task('jekyll', shell.task([
  'jekyll build',
]));

gulp.task('sass', function() {
  return gulp.src(['./scss/styles.scss'])
      .pipe(sass())
      .pipe(autoprefixer({
          browsers: ['last 2 versions'],
          cascade: false
      }))
      .pipe(gulp.dest("./css"));
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
  runSequence('sass',
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
              './scss/**/*.*',
              './_posts/**/*.*',
              './blog-images/**/*.*',
              './js/**/*.*'], ['rebuild']);
});


// Dev Mode

gulp.task('dev', function(callback) {
  runSequence(['sass'],
              'jekyll',
              ['server', 'watch'],
              callback);
});
