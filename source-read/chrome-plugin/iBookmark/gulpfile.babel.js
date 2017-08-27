'use strict'

import gulp from 'gulp'

import browserify from 'browserify'
import babelify from 'babelify'
import source from 'vinyl-source-stream'

import jshint from 'gulp-jshint'
import minifyCss from 'gulp-minify-css'
import imagemin from 'gulp-imagemin'
import uglify from 'gulp-uglify'
import less from 'gulp-less'

import concat from 'gulp-concat'
import rename from 'gulp-rename'

gulp.task('scripts', () => {
  return browserify("app/js/index.js")
    .transform("babelify")
    .bundle()
    .pipe(source("index.js"))
    .pipe(gulp.dest("./app/build/js"))
})

gulp.task('scripts-opt', () => {
  return browserify("app/js/options.js")
    .transform("babelify")
    .bundle()
    .pipe(source("options.js"))
    .pipe(gulp.dest("./app/build/js"))

})

gulp.task('build', ['scripts','scripts-opt'],() => {
  gulp.src(['./app/build/js/index.js','./app/build/js/options.js'])
    .pipe(rename({
      'suffix': '-min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./app/build/js'))
})

gulp.task('css', () => {
  gulp.src('app/css/*.less')
    .pipe(less())
    .pipe(gulp.dest('./app/build/css/'))
    .pipe(minifyCss())
    .pipe(rename({
      'suffix': '-min'
    }))
    .pipe(gulp.dest('./app/build/css/'))
})

gulp.task('img', () => {
  gulp.src('app/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./app/build/img'))
})



gulp.task('default', () => {
  gulp.watch('app/css/*.less', ['css'])
  gulp.watch('app/js/*.js', ['scripts','scripts-opt'])
  gulp.watch('app/img/*.png', ['img'])
})