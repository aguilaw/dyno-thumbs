/*var gulp        = require('gulp');

*/

// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var browserSync = require('browser-sync').create();
var jshint = require('gulp-jshint');
var sass   = require('gulp-sass');
var concat = require('gulp-concat');
var prefix = require('gulp-autoprefixer');
var jade   = require('gulp-jade');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./app"
    });

    gulp.watch("app/scss/*.scss", ['sass']);
    gulp.watch("app/*.html").on('change', browserSync.reload);
});


//browserSync task
gulp.task('browser-sync',['sass','scripts'], function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

//jade task
gulp.task('jade', function () {
  return gulp.src('jadefiles/index.jade')
  .pipe(jade())
  .pipe(gulp.dest('./'))
  .pipe(browserSync.stream());
});

// Lint Task
gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('sass/main.sass')
        .pipe(sass({
            includePaths: ['css'],
            onError: browserSync.notify
        }))
        .on('error', onError)
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('assets/css'))
        .pipe(browserSync.stream());
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('assets/js-dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .on('error', onError)
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('assets/js-dist'));
});

//errors
function onError(err) {
  console.log(err);
  this.emit('end');
}

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['lint', 'scripts']);
    gulp.watch('sass/*.sass', ['sass']);
    gulp.watch('jadefiles/*.jade',['jade']);
});

// Default Task
gulp.task('default', ['browser-sync', 'watch']);
