var del = require('del');
var browserSync = require('browser-sync');
var gulp = require('gulp');
var sass = require('gulp-sass');
var ghPages = require('gulp-gh-pages');

var outDir = 'out';

gulp.task('clean', cleaner);

gulp.task('build:assets', copyAssets);
gulp.task('build:sass', compileSass);
gulp.task('build', ['build:assets', 'build:sass']);

gulp.task('dev', ['build'], setupWatcher);
gulp.task('deploy', ['build'], deployToGithub);

function cleaner(cb) {
  del([outDir], cb);
}

function copyAssets() {
  return gulp.src(['src/assets/**'], {dot : true})
    .pipe(gulp.dest(outDir));
}

function compileSass() {
  return gulp.src(['src/sass/**/*.scss', '!src/sass/**/_*.scss'])
    .pipe(sass())
    .pipe(gulp.dest(outDir + '/css'));
}

function deployToGithub() {
  return gulp.src(outDir + '/**')
    .pipe(ghPages({
      branch : 'master'
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
