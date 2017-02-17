var gulp = require('gulp'),
    rename = require('gulp-rename'),
    uglify = require("gulp-uglify"),
    minifyCss = require("gulp-minify-css"),
    minifyHtml = require("gulp-minify-html"),
    jshint = require("gulp-jshint"),
    concat = require("gulp-concat"),
    imagemin = require('gulp-imagemin');
    // sourcemaps = require('gulp-sourcemaps'),
    // autoprefixer = require('gulp-autoprefixer');

//gulp-rename gulp-jshint gulp-concat gulp-uglify gulp-minify-css gulp-minify-html gulp-imagemin gulp-livereload gulp-sourcemaps gulp-autoprefixer 
//重命名
//js压缩
gulp.task('minify-js', function () {
    gulp.src('./public/js/*.js') // 要压缩的js文件
    .pipe(uglify())  //使用uglify进行压缩,更多配置请参考：
    .pipe(gulp.dest('./dist/js')); //压缩后的路径
    console.log("js压缩完成")
});
//css压缩
gulp.task('minify-css', function () {
    gulp.src('./public/css/*.css') // 要压缩的css文件
    .pipe(minifyCss()) //压缩css
    .pipe(gulp.dest('./dist/css'));
    console.log("css压缩完成")
});
//html压缩
gulp.task('minify-html', function () {
    gulp.src('./views/*.hbs') // 要压缩的html文件
    .pipe(minifyHtml()) //压缩
    .pipe(gulp.dest('./dist/html'));
});
//js代码检查
gulp.task('jsLint', function () {
    gulp.src('./public/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter()); // 输出检查结果
    console.log("js代码检查完成")
});
//文件合并
gulp.task('concat', function () {
    gulp.src('./public/js/*.js')  //要合并的文件
    .pipe(concat('all.js'))  // 合并匹配到的js文件并命名为 "all.js"
    .pipe(gulp.dest('./dist/js'));
    console.log("文件合并完成")
});
//图片压缩
gulp.task('default', function () {
    return gulp.src('./public/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/img'));
        console.log("图片压缩完成")
});
//自动添加前缀
// gulp.task('demo', function() {
//     var css = [...];
//     gulp.src(css)
//         .pipe(sourcemaps.init())
//         .pipe(concat("styles.css"))
//         .pipe(cssnano())
//         .pipe(sourcemaps.write('.'))
//         .pipe(gulp.dest('./www/build'));   
// });