"use strict";
var express = require('express');
var app = express();
var path = require('path');

var port = process.env.PORT;

//require modules
var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
     del = require('del'),
  imagemin = require('gulp-imagemin'),
livereload = require('gulp-livereload'),
   connect = require('connect');

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
    .pipe(gulp.dest(options.dist + '/styles'))
    .pipe(livereload());
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

function startExpress() {
  app.listen(port);
  console.log("The Frontend Server is Running....PORT" + port);
  
  app.use('/static', express.static(__dirname +'/src'));  //static files
  app.use('/dist', express.static(__dirname +'/dist'));  //static files
	
	app.set('view engine', 'pug');  //This is from the Jade
	// part of the Treehouse Express Class.
	app.set('views', __dirname + '/src/templates'); 
	
	app.get('/', function(req, res) {
	    res.render('index.pug'); 
	});
}

//set up the build task to call the other tasks, with clean completing first.
gulp.task('build', function() {
  return gulp.src([options.src + '/styles/all.min.css', '/scripts/all.min.js'], { base: './'})
	.pipe(gulp.dest(options.dist));
});

//set up the default gulp task to have build as a dependency.
gulp.task('default', ['build']);

//set up the serve task to build and serve the project while using watch for any changes
gulp.task('serve', ['watch']);

gulp.task('startExpress', function(){
  startExpress();
});

// var directories = ['src/sass/**/*.scss', 'src/js/**/*.js', 'src/templates/index.pug'];

gulp.task('watchStyles', function(){ 
  livereload.listen();
  gulp.watch(['src/sass/**/*.scss'], ['pug']);
});

gulp.task('pug', ['styles'], function(){
    // livereload.listen(8081);
    console.log('log pugReload');
    return gulp.src('src/templates/index.pug')
    .pipe(livereload());
});
