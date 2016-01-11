var del = require('del');
var browserSync = require('browser-sync');
var gulp = require('gulp');
var sass = require('gulp-sass');
var ghPages = require('gulp-gh-pages');

var outDir = 'out';
var cacheDir = '.publish';

gulp.task('clean', cleaner);

gulp.task('build:assets', copyAssets);
gulp.task('build:sass', compileSass);
gulp.task('build:copyFavicons', copyFavicons);
gulp.task('build', ['build:assets', 'build:sass', 'build:copyFavicons']);

gulp.task('dev', ['build'], setupWatcher);
gulp.task('deploy', ['build'], deployToGithub);

function cleaner(cb) {
  del([outDir, cacheDir], cb);
}

function copyFavicons() {
  return gulp.src(['src/assets/images/favicons/**'], {dot : true})
    .pipe(gulp.dest(outDir))
    .pipe(browserSync.stream());
}

function copyAssets() {
  return gulp.src(['src/assets/**', '!src/assets/images/favicons/', '!src/assets/images/favicons/**'], {dot : true})
    .pipe(gulp.dest(outDir))
    .pipe(browserSync.stream());
}

function compileSass() {
  return gulp.src(['src/sass/**/*.scss', '!src/sass/**/_*.scss'])
    .pipe(sass())
    .pipe(gulp.dest(outDir + '/css'))
    .pipe(browserSync.stream());
}

function deployToGithub() {
  return gulp.src(outDir + '/**', {dot : true})
    .pipe(ghPages({
      branch : 'master',
      cacheDir : cacheDir
    }));
}

function setupWatcher() {
  browserSync({
    server : {
      baseDir : outDir
    },
    open : false
  });

  gulp.watch(['src/sass/**'], ['build:sass']);
  gulp.watch(['src/assets/**'], ['build:assets']);
}
