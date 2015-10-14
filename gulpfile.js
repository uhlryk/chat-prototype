var gulp = require('gulp'),
gutil = require("gulp-util"),
concat = require("gulp-concat"),
browserify = require("browserify"),
source = require("vinyl-source-stream"),
livereload = require('gulp-livereload'),
compass = require("gulp-compass"),
minifyCSS = require("gulp-minify-css");

gulp.task("scripts",function(){
  browserify('./frontend/scripts/app.js',{debug: true})
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest('./public/js'))
  .pipe(livereload())
  ;
});
gulp.task("view", function(){
  gulp.src(["frontend/views/**/*.html","frontend/views/*.html"])
  .pipe(gulp.dest("public/js/views/"))
  .pipe(livereload())
  ;
});
gulp.task("partial", function(){
  gulp.src(["frontend/partials/**/*.html","frontend/partials/*.html"])
  .pipe(gulp.dest("public/js/partials/"))
  .pipe(livereload())
  ;
});
gulp.task("html", function(){
  gulp.src(["frontend/*.html"])
  .pipe(gulp.dest("public/"))
  .pipe(livereload())
  ;
});
gulp.task("css",function(){
  gulp.src(["./frontend/sass/style.scss"])
  .pipe(compass({
    sass : "./frontend/sass/",
    image : "./public/img",
    style : "expanded",
    css : "./public/css",
    sourcemap:true,
    import_path : "./bower_components/bootstrap-sass/assets/stylesheets/"
  }).on("error",gutil.log))
  .pipe(minifyCSS())
  .pipe(gulp.dest("./public/css"))
  .pipe(livereload())
  ;
});
gulp.task("watch",function(){
  livereload.listen();
  gulp.watch(["frontend/sass/**/*.scss"],["css"]);
  gulp.watch(["frontend/scripts/**/*.js"],["scripts"]);
  gulp.watch(["frontend/partials/**/*.html"],["partial"]);
  gulp.watch(["frontend/views/**/*.html"],["view"]);
  gulp.watch(["frontend/*.html"],["html"]);
});
gulp.task("all", ["css", "scripts", "partial", "view", "html"]);
gulp.task("default", ["css", "scripts", "partial", "view", "html", "watch"]);
