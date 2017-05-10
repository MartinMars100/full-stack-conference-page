'use strict';

var port = process.env.PORT;
var ip = process.env.IP;

//require modules
  var gulp = require('gulp'),
   express = require('express'),
      path = require('path'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
      sass = require('gulp-sass'),
      maps = require('gulp-sourcemaps'),
       del = require('del'),
  imagemin = require('gulp-imagemin'),
  connect  = require('gulp-connect'),
     watch = require('gulp-watch'),
      less = require('gulp-less');


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
    .pipe(gulp.dest(options.dist + '/scripts'));
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
    .pipe(gulp.dest(options.dist + '/styles'));
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
gulp.task('build', function() {
  return gulp.src([options.src + '/styles/all.min.css', '/scripts/all.min.js'], { base: './'})
	.pipe(gulp.dest(options.dist));
});

//set up the default gulp task to have build as a dependency.
// gulp.task('default', ['build']);

//set up the serve task to build and serve the project while using watch for any changes
gulp.task('serve', ['watch']);

// gulp.task('watchStyles', function(){ 
//   gulp.watch(['src/sass/**/*.scss'], ['styles']);
// });

gulp.task('webserver', function() {
  connect.server({
    port: port,
    ip: ip,
    livereload: {
      port: port,
      ip: ip
    }
  });
  console.log("Server is Running....PORT " + port + " IP " + ip);
});
 
gulp.task('default', ['webserver']);

// gulp.task('livereload', function() {
//   gulp.src('src/sass/**/*.scss')
//   .pipe(watch('src/sass/**/*.scss'), ['styles'])
//   .pipe(connect.reload());
// });

// gulp.task('watch', function() {
//   gulp.watch('src/sass/**/*.scss', ['styles']);
//   // gulp.watch('src/sass/**/*.scss');
// })

gulp.task('less', function() {
  gulp.src('src/sass/**/*.scss')
    .pipe(less())
    .pipe(gulp.dest(options.dist + '/styles'))
    .pipe(connect.reload());
});
 
gulp.task('watch', function() {
    gulp.watch('src/sass/**/*.scss', ['styles', 'less']);
})