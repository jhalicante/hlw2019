var gulp = require('gulp'),
	plumber = require('gulp-plumber'),
	autoprefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	sass = require('gulp-sass'),
	nunjucksRender = require('gulp-nunjucks-render'),
	browserSync = require('browser-sync');

var pagesDir = 'src/templates';
var templatesDir = 'src/templates/';

// Tasks
gulp.task('browser-sync', function () {
	browserSync({
		server: './',
		notify: false,
		ui: false,
		port : 2019
	});
});

gulp.task('bs-reload', function () {
	browserSync.reload();
});

gulp.task('styles', function () {
	gulp.src('src/styles/*.scss')
		.pipe(plumber({
			errorHandler: function (error) {
				console.log(error.message);
				this.emit('end');
			}
		}))
		.pipe(sass({
			outputStyle: 'compressed'
		}))
		.pipe(autoprefixer('last 3 versions'))
		.pipe(concat('master.min.css'))
		.pipe(gulp.dest('src/styles'))
		.pipe(browserSync.stream());
});

gulp.task('scripts', function () {
	gulp.src('src/scripts/master.js')
		.pipe(plumber({
			errorHandler: function (error) {
				console.log(error.message);
				this.emit('end');
			}
		}))
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(concat('master.min.js'))
		.pipe(uglify({
			preserveComments: 'some changes happened'
		}))
		.pipe(gulp.dest('src/scripts'))		
		.pipe(browserSync.stream());
});

// compile .nunjucks pages into .html
gulp.task('nunjucks', function () {
	return gulp.src(pagesDir + '/**/*.+(nj)')
	.pipe(nunjucksRender({
		path: [templatesDir]
	}))
	.on('error', function (e) {
		console.log(e);
		this.emit('end');
	})
	.pipe(gulp.dest('./'));
});

gulp.task('default', ['browser-sync', 'nunjucks'], function () {
	gulp.watch('src/styles/**/*.scss', ['styles']);
	gulp.watch('src/scripts/**/*.js', ['scripts']);
	gulp.watch('./**/*.nj', ['nunjucks', browserSync.reload]);
	gulp.watch(['**/*.html', '!node_modules'], ['bs-reload']);
});
