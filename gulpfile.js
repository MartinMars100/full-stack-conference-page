'use strict';

var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
imagemin = require('gulp-imagemin'),
  concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
  useref = require('gulp-useref'),
     iff = require('gulp-if'),
    csso = require('gulp-csso'),
 connect = require('gulp-connect'),
     del = require('del');

var options = {
    src: 'src',
    dist: 'dist'
};

gulp.task('hello', function() {
  console.log('helloooo!');
});

gulp.task('default', ['hello'], function() {
  console.log('This is the default task!!!!');
});

// Concatenates, minifies, stores new file as all.min.js located
// in the dist/scripts folder
// Source maps are created with the name all.min.js.map and 
// stored in the same dist/scripts folder.
gulp.task('scripts', function() {
	  return gulp.src(options.src + '/**/*.js')
		   .pipe(maps.init())
		   .pipe(uglify())
		   .pipe(concat('all.min.js'))
		   .pipe(maps.write('./'))
		   .pipe(gulp.dest(options.dist + '/scripts'));
});

// The scss files are concatendated and minified using CSSO.
// The new file is named all.min.css and stored in dist/styles folder.
// A source map for the css files is store in the same folder.
gulp.task('styles', function() {
	  return gulp.src(options.src + '/sass/global.scss')
		   .pipe(maps.init())
		   .pipe(sass())
		   .pipe(csso())
		   .pipe(rename('all.min.css'))
		   .pipe(maps.write('./'))
	     .pipe(gulp.dest(options.dist + '/styles'));
});

// Optimize the size of the project’s JPEG and PNG files,  
// and then copy those optimized images to the dist/content folder.
gulp.task('images', function() {
	  return gulp.src(options.src + '/images/*')
		   .pipe(imagemin())
		   .pipe(gulp.dest(options.dist + '/content'));
});

// Delete dist folder and all of the files inside
gulp.task('clean', function() {
	  return del.sync(options.dist);
});

// Build task will run after clean, scripts, styles and images tasks run.
// The build task copies /index.html and /icons to the dist folder.
gulp.task('build', ['clean', 'scripts', 'styles', 'images'], function() {
	  return gulp.src([options.src + "/index.html", options.src + "/icons/**"], { base: options.src + '/'})
		   .pipe(gulp.dest(options.dist));
});

// The gulp default task
gulp.task('default', function() {
	  gulp.start('build');
});

// Gulp task will start a server
gulp.task('serve', ['build'], function() {
    connect.server({
        root: 'dist',
        livereload: true
    });
});

// Runs the serve task and watches js files for a change. 
// On js file change the scripts task runs
gulp.task('watch', ['serve'], function() {
	  gulp.watch(options.src + '/**/*.js', ['scripts']);
});




