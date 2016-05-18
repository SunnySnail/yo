var gulp = require('gulp'),
    sass = require('gulp-sass'),
    replace = require('gulp-replace'),
    babel = require('gulp-babel'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    plumber = require('gulp-plumber'),
    output = '<%= projectOutput %>';

gulp.task('sass', function(){
    gulp.src('./src/sass/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest('<%= projectOutput %>/css'));

})

gulp.task('html', function(){
    gulp.src('./src/html/*.html')
        .pipe(replace(/\.\.\/sass\/(\S+)\.scss/g, '../css/$1.css'))
        .pipe(gulp.dest('<%= projectOutput %>/html'));
})

gulp.task('images', function(){
    gulp.src('./src/images/')
        .pipe(gulp.dest('<%= projectOutput %>/images'));
})

gulp.task('babel', function(){
    gulp.src('./src/js/*.js')
        .pipe(plumber())
        .pipe(babel({
            presets: ['es2015','stage-0'],
            plugins: ['transform-remove-strict-mode']
        }))
        .pipe(gulp.dest('<%= projectOutput %>/js'));
})

gulp.task('default', ['html','images','sass','babel']);

gulp.task('browser-sync',['sass-watch','babel-watch','html'], function(){
    browserSync.init({
        server: {
            baseDir: output
        }
    })
    gulp.watch("./src/sass/*.scss", ['sass-watch']);
    gulp.watch("./src/js/*.js",['babel-watch']);
    gulp.watch("./src/html/*.html",['html']).on('change', reload);
})

gulp.task('sass-watch', function() {
    return gulp.src("./src/sass/*.scss")
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest("<%= projectOutput %>/css/"))
        .pipe(reload({stream: true}));
});

gulp.task('babel-watch', function(){
    return gulp.src('./src/js/*.js')
        .pipe(plumber())
        .pipe(babel({
            presets: ['es2015','stage-0'],
            plugins: ['transform-remove-strict-mode']
        }))
        .pipe(gulp.dest('<%= projectOutput %>/js'))
        .pipe(reload({stream:true}));
})


gulp.task('dev',['browser-sync']);

