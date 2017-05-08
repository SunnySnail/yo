var gulp = require('gulp'),
    sass = require('gulp-sass'),
    replace = require('gulp-replace'),
    babel = require('gulp-babel'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    plumber = require('gulp-plumber'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssmin = require('gulp-cssmin'),
    uglify = require('gulp-uglify'),
    minifyhtml = require('gulp-minify-html'),
    requirejsOptimize = require('gulp-requirejs-optimize'),
    output = './online',
    publicPath = '..',
    date = (new Date()).getTime();

gulp.task('sass', function(){
    var processors = [
        autoprefixer
    ]
    gulp.src('./src/sass/*.scss')
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(replace(/\.\.\/images\/(\S+)\.(png|gif|jpeg|jpg)/g, publicPath+'/images/$1.$2?v='+date))
        .pipe(cssmin().on('error', function(err) {
            console.log(err);
        }))
        .pipe(gulp.dest(output+'/css/'));

})

gulp.task('html', function(){
    gulp.src('./src/html/*.html')
        .pipe(replace(/\.\.\/sass\/(\S+)\.scss/g, publicPath+'/css/$1.css?v='+date))
        .pipe(replace(/\.\.\/js\/(\S+)\.js/g, publicPath+'/js/$1.js?v='+date))
        .pipe(minifyhtml({
          empty: true,
          spare: true
        }))
        .pipe(gulp.dest(output+'/html'));
})

gulp.task('images', function(){
    gulp.src('./src/images/**')
        .pipe(gulp.dest(output+'/images'));
})


gulp.task('babel-online', function(){
    return gulp.src('./src/js/*.js')
        .pipe(plumber())
        .pipe(babel({
            presets: ['es2015','stage-0'],
            plugins: ['transform-remove-strict-mode']
        }))
        .pipe(replace(/\.\.\/images\/(\S+)\.(png|gif|jpeg|jpg)/g, publicPath+'/images/$1.$2?v='+date))
        .pipe(gulp.dest(output+'/js/'));
})

gulp.task('babel', function(){
    gulp.src(['./src/js/lib/**'])
        .pipe(plumber())
        .pipe(babel({
            presets: ['es2015','stage-0'],
            plugins: ['transform-remove-strict-mode']
        }))
        .pipe(replace(/\.\.\/images\/(\S+)\.(png|gif|jpeg|jpg)/g, publicPath+'/images/$1.$2?v='+date))
        .pipe(uglify())
        .pipe(gulp.dest(output+'/js'));
})

gulp.task('rjs', ['babel-online'], function() {
    gulp.src(output+'/js/*.js')
        .pipe(requirejsOptimize({
            optimize: 'none',
            baseUrl: output+'/js/'
        }))
        .pipe(gulp.dest(output+'/js/'))
})


gulp.task('default', ['html','images','sass','babel','rjs']);

gulp.task('browser-sync',['sass-watch','babel-watch','rjs-watch','html-watch','images-watch'], function(){
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    })
    gulp.watch("./src/sass/*.scss", ['sass-watch']);
    gulp.watch("./src/js/mod/**",['rjs-watch']);
    gulp.watch("./src/js/**", ['babel-watch']);
    gulp.watch("./src/images/**", ['images-watch']);
    gulp.watch("./src/html/*.html",['html-watch']).on('change', reload);
})

gulp.task('html-watch', function(){
    gulp.src('./src/html/*.html')
        .pipe(replace(/\.\.\/sass\/(\S+)\.scss/g, '../css/$1.css'))
        .pipe(replace(/\.\.\/js\/(\S+)\.js/g, '../js/$1.js'))
        .pipe(gulp.dest('./dist/html'));
})

gulp.task('sass-watch', function() {
    var processors = [
        autoprefixer
    ]
    gulp.src('./src/sass/*.scss')
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(reload({stream:true}));
});
gulp.task('images-watch', function(){
    gulp.src('./src/images/**')
        .pipe(gulp.dest('./dist/images'));
})

gulp.task('babel-watch', function(){
    return gulp.src(['./src/js/lib/**'])
        .pipe(plumber())
        .pipe(babel({
            presets: ['es2015','stage-0'],
            plugins: ['transform-remove-strict-mode']
        }))
        .pipe(gulp.dest('./dist/js/'))
        .pipe(reload({stream:true}));
})

gulp.task('babel-dev', function(){
    return gulp.src('./src/js/*.js')
        .pipe(plumber())
        .pipe(babel({
            presets: ['es2015','stage-0'],
            plugins: ['transform-remove-strict-mode']
        }))
        .pipe(gulp.dest('./dist/js/'));
})

gulp.task('rjs-watch', ['babel-dev'], function() {
    gulp.src('./dist/js/*.js')
        .pipe(requirejsOptimize({
            optimize: 'none',
            baseUrl: './dist/js/'
        }))
        .pipe(gulp.dest('./dist/js/'))
        .pipe(reload({stream:true}))
})


gulp.task('dev',['browser-sync']);

