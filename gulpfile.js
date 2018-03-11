'use strict';

var port = process.env.PORT;
var ip = process.env.IP;

//require modules
  var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
      sass = require('gulp-sass'),
      maps = require('gulp-sourcemaps'),
       del = require('del'),
  imagemin = require('gulp-imagemin'),
  connect  = require('gulp-connect'),
     watch = require('gulp-watch');


var options = {
    src: 'src',
    dist: 'dist'
};

//concat the scripts
gulp.task("concatScripts", function() {
    return gulp.src([
	     'src/js/circle/autogrow.js',
	     'src/js/circle/circle.js'])
	  .pipe(maps.init())
	  .pipe(concat('global.js'))
	  .pipe(maps.write('./'))
	  .pipe(gulp.dest(options.dist + '/scripts'));
});

//minify the scripts
gulp.task("scripts", ["concatScripts"], function() {
    return gulp.src(options.dist + 'scripts/global.js')
    .pipe(maps.init())
    .pipe(uglify(options.dist + 'scripts/global.js'))
    .pipe(rename('app.min.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest(options.dist + '/scripts'))
    .pipe(connect.reload());
});

//Styles
gulp.task('styles', function(){
    console.log('log a');
	  return gulp.src('src/sass/global.scss') // Compile the sass into css
    .pipe(maps.init())
    .pipe(sass())
    //.pipe(csso())
    .pipe(rename('global.css'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest(options.dist + '/styles'))
    .pipe(connect.reload());
});

//clean task to clean up the folders before the build runs
gulp.task('clean', function() {
  return del.sync(options.dist);
});

//minifiy images, dest dist/content
gulp.task('images', function() {
  return gulp.src(options.src + '/images/*')
	.pipe(imagemin())
	.pipe(gulp.dest(options.dist + '/content'));
});

//set up the build task to call the other tasks, with clean completing first.
gulp.task('build', ['clean'], function() {
  gulp.start(['styles', 'scripts', 'images']);
  return gulp.src([options.src + '/styles/all.min.css', '/scripts/all.min.js'], { base: './'})
	.pipe(gulp.dest(options.dist));
});

gulp.task("serve", function() {
    connect.server({
    port: process.env.PORT,
    ip: process.env.IP,
    // livereload: true
    livereload: {
      port: 8081,
      ip: process.env.IP
    }
  });
  console.log("Server is Running....PORT " + port + " IP " + ip);
});
 
gulp.task('default', ['serve']);

gulp.task('livereload', function() {
  gulp.src('src/sass/**/*.scss')
  .pipe(watch('src/sass/**/*.scss'), ['styles'])
  .pipe(connect.reload());
});

gulp.task('watch', ['serve'], function() {
  gulp.watch('src/sass/**/*.scss', ['styles']);
  gulp.watch('src/js/**/*.js', ['scripts']);
});

 
// gulp.task('watch', function() {
//     gulp.watch('src/sass/global.scss', ['styles']);
// })