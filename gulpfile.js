var     gulp         = require('gulp'),
        clean        = require('gulp-clean'), // Для отчистки папки dist
        cache        = require('gulp-cache'), // Чистим кеш при запуске галпа
		sass         = require('gulp-sass'), 
		autoprefixer = require('gulp-autoprefixer'),
		cleanCSS    = require('gulp-clean-css'),
		rename       = require('gulp-rename'),
		browserSync  = require('browser-sync').create(),
		pug          = require('gulp-pug'),
		concat       = require('gulp-concat'),
		notify       = require("gulp-notify"), //Уведомления при сов. ошибок, не прерывает работу галп
		gutil        = require('gulp-util'), // какие то утилиты, он не подключен
		include      = require("gulp-include"), //вставляем css в шапку
		removeLine   = require( "gulp-remove-line" ), // Удаляет ненужные строки из индекса
		uglify       = require('gulp-uglifyjs'); //Соединение js

gulp.task('browser-sync', ['styles', 'scripts', 'pug'], function() {
		browserSync.init({
				server: {
						baseDir: "./app"
				},
				notify: false
		});
		
});

gulp.task('clear', function (done) {
  return cache.clearAll(done);
});

gulp.task('styles', function () {
	return gulp.src(['app/assets/sass/**/*.scss',])
	.pipe(sass({
		includePaths: require('node-bourbon').includePaths
	}).on("error", notify.onError()))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(gulp.dest('app/assets/css'))
	.pipe(browserSync.stream());
});

gulp.task('pug', function() {
	return gulp.src('app/assets/pug/*.pug')
	.pipe(pug({
		pretty: true
  	})).on("error", notify.onError())
	.pipe(gulp.dest('app/'))
	.pipe(browserSync.stream());
});

gulp.task('scripts', function() {
	return gulp.src([
		'./app/assets/libs/modernizr/modernizr.js',
		'./app/assets/libs/jquery/dist/jquery.min.js',
		'./app/assets/libs/bootstrap/dist/js/bootstrap.min.js',
		'./app/assets/libs/waypoints/waypoints.min.js',
		'./app/assets/libs/animate/animate-css.js',
		'./app/assets/libs/plugins-scroll/plugins-scroll.js',
		])
		.pipe(concat('libs.js'))
		// .pipe(uglify()) //Minify libs.js
		.pipe(gulp.dest('./app/assets/js/'));
});

gulp.task('watch', function () {
	gulp.watch('app/assets/sass/**/*.scss', ['styles']);
	gulp.watch('app/assets/pug/*.pug', ['pug']);
	gulp.watch('app/assets/libs/**/*.js', ['scripts']);
	gulp.watch('app/assets/js/*.js').on("change", browserSync.reload);
	gulp.watch('app/*.html').on('change', browserSync.reload);
});

gulp.task('include', ['pug'], function () {
	return gulp.src('app/index.html')
	.pipe(include()).on("error", notify.onError())
	.pipe(gulp.dest('dist'));
});

gulp.task('build', ['clean', 'styles', 'pug', 'scripts'], function() {

	var buildHTML = gulp.src([
		'app/*.html',
		]).pipe( removeLine( { "index.html": [ 30 ] } ) )
		.pipe(include())
		.pipe(gulp.dest('dist'));

	var buildCSS= gulp.src([
		'app/assets/css/*.css',
		]).pipe(gulp.dest('dist/assets/css'));

	var buildJS = gulp.src([
		'app/assets/js/*.js',
		]).pipe(gulp.dest('dist/assets/js'));

	var buildIMG = gulp.src([
		'app/assets/img/**/*',
		]).pipe(gulp.dest('dist/assets/img'));

	var buildLIBS = gulp.src([
		'app/assets/libs/**/*',
		]).pipe(gulp.dest('dist/assets/libs'));

});

gulp.task('clean', function () {  
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

gulp.task('default', ['browser-sync', 'watch', 'clear']);
