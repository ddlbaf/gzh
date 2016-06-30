//引入gulp
var gulp = require('gulp');

//引入组件
var htmlmin = require('gulp-htmlmin'), //html压缩
    imagemin = require('gulp-imagemin'),//图片压缩
    pngcrush = require('imagemin-pngcrush'),
    minifycss = require('gulp-minify-css'),//css压缩
    jshint = require('gulp-jshint'),//js检测
    uglify = require('gulp-uglify'),//js压缩
    concat = require('gulp-concat'),//文件合并
    rename = require('gulp-rename'),//文件更名
    notify = require('gulp-notify');//提示信息
var transport = require("gulp-seajs-transport");

// 压缩图片
gulp.task('img', function() {
    return gulp.src('./webtest/source/img/**/**')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngcrush()]
        }))
        .pipe(gulp.dest('./webtest/res/img/'))
        .pipe(notify({ message: 'img task ok' }));
});

// 合并、压缩、重命名css
gulp.task('css', function() {
    return gulp.src('./webtest/source/css/**/**')
        .pipe(minifycss())
        .pipe(gulp.dest('./webtest/res/css/'))
        .pipe(notify({ message: 'css task ok' }));
});

// 检查js
gulp.task('lint', function() {
    return gulp.src('./webtest/source/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(notify({ message: 'lint task ok' }));
});


// 合并、压缩js文件
gulp.task('js', function() {
    return gulp.src('./webtest/source/js/**/**')
        .pipe(transport())
        .pipe(gulp.dest('./webtest/res/js'))
        .pipe(uglify())
        .pipe(gulp.dest('./webtest/res/js'))
        .pipe(notify({ message: 'js task ok' }));
});


gulp.task('default', function(){
    gulp.run('img', 'css', 'lint', 'js');

})

