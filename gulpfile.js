'use strict';

var express = require('express');
var parser = require('body-parser');
// var router = require('api-router');
 
var app = express();
var path = require('path');

// require('./public/database.js'); // dot goes down one level 
// require('./seed');

var port = process.env.PORT;


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

//sources watched for livereload
var cssSources = [options.src + '/**/*.js'];
var jsSources = [options.src + '/**/*.scss'];
var allSources = cssSources.concat(jsSources);

gulp.task('hello', function() {
  console.log('helloooo!');
});

// Concatenates, minifies, stores new file as all.min.js located
// in the dist/scripts folder
// Source maps are created with the name all.min.js.map and 
// stored in the same dist/scripts folder.
gulp.task('scripts', function() {
	  console.log('log scripts');
	  return gulp.src(options.src + '/**/*.js')
		   .pipe(maps.init())
		   .pipe(uglify())
		   .pipe(concat('all.min.js'))
		   .pipe(maps.write('./'))
		   .pipe(gulp.dest(options.dist + '/scripts'));
		   //.pipe(connect.reload());
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
gulp.task('default', ['server', 'watch'], function() {
	  gulp.start('build');
});

//local-server
gulp.task('server', function() {
	app.listen(port, function() {
    console.log("Theeee Frontend Server is Running....PORT" + port);
    app.use('/static', express.static(__dirname +'/src'));  //static files
    app.use('/dist', express.static(__dirname +'/dist'));  //static files
	app.use(parser.json());
	
	app.set('view engine', 'jade');  //This is from the Jade
	// part of the Treehouse Express Class.
	app.set('views', __dirname + '/src/templates'); 
	
	app.get('/', function(req, res) {
	    res.render('index.jade'); //The Jade Way--you don't have to use
	                              // this jade extension / res.render('index.ejs');
	});
});
  //connect.server({
  //  root: 'app',
  //  port: process.env.PORT,
  //  host: process.env.IP,
  //  livereload: true
  //});
});

//livereload
gulp.task('livereload', ['build'], function() {
    app.get('/', function(req, res) {
    res.render('index.jade'); 
    });
});

//watch the file changes to trigger livereload
gulp.task('watch', function() {
  gulp.watch(allSources, ['livereload']);
});
