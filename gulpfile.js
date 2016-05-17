const gulp = require('gulp');
const del = require('del');
// const tslint = require('gulp-tslint');
const typescript = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const tscConfig = require('./src/tsconfig.json');

// clean the contents of the distribution directory
gulp.task('clean', function () {
  return del('dist/**/*');
});

// gulp.task('tslint', function() {
//   return gulp.src('src/**/*.ts')
//     .pipe(tslint())
//     .pipe(tslint.report('verbose'));
// });

// TypeScript compile
gulp.task('compile', ['clean'], function () {
  return gulp.src('src/**/*.ts')
             .pipe(sourcemaps.init())
             .pipe(typescript(tscConfig.compilerOptions))
             .pipe(sourcemaps.write('.'))
             .pipe(gulp.dest('dist'));
});

// copy dependencies
gulp.task('vendor', ['clean'], function() {
  gulp.src('node_modules/@angular/**/*.js')
      .pipe(gulp.dest('dist/lib/@angular'));

  gulp.src('node_modules/systemjs/dist/system.src.js')
      .pipe(gulp.dest('dist/lib/systemjs/dist'));

  gulp.src('node_modules/zone.js/dist/*.js')
      .pipe(gulp.dest('dist/lib/zone.js/dist'));

  gulp.src('node_modules/es6-shim/es6-shim.js')
      .pipe(gulp.dest('dist/lib/es6-shim'));

  gulp.src('node_modules/reflect-metadata/*.js')
      .pipe(gulp.dest('dist/lib/reflect-metadata'));

  gulp.src('node_modules/rxjs/**/*.js')
      .pipe(gulp.dest('dist/lib/rxjs'));

  gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css')
      .pipe(gulp.dest('dist/lib/bootstrap/dist/css'));

  gulp.src('node_modules/bootstrap/dist/js/**/*.js')
      .pipe(gulp.dest('dist/lib/bootstrap/dist/js'));

  gulp.src('node_modules/jquery/dist/jquery.min.js')
      .pipe(gulp.dest('dist/lib/jquery/dist'));

  gulp.src('node_modules/tether/dist/js/tether.min.js')
      .pipe(gulp.dest('dist/lib/tether/dist/js'));

  gulp.src('node_modules/font-awesome/css/font-awesome.min.css')
      .pipe(gulp.dest('dist/lib/font-awesome/css'));

  gulp.src('node_modules/font-awesome/fonts/*')
      .pipe(gulp.dest('dist/lib/font-awesome/fonts'));

  gulp.src(['node_modules/toastr/build/toastr.min.css','node_modules/toastr/build/toastr.min.js'])
      .pipe(gulp.dest('dist/lib/toastr/build'));
});

// copy static assets - i.e. non TypeScript compiled source
gulp.task('resources', ['clean'], function() {
  return gulp.src(['src/**/*', '!src/**/*.ts', '!src/**/*.js', '!src/**/*.js.map'])
             .pipe(gulp.dest('dist/'));
});

// Watch for changes in TypeScript, HTML and CSS files.
gulp.task('watch', ['build'], function () {
    gulp.watch(["src/**/*.ts"], ['build']).on('change', function (e) {
        console.log('TypeScript file ' + e.path + ' has been changed. Compiling.');
    });
    gulp.watch(["src/**/*.html", "src/**/*.css"], ['build']).on('change', function (e) {
        console.log('Resource file ' + e.path + ' has been changed. Updating.');
    });
});

gulp.task('build', ['clean', 'compile', 'resources', 'vendor']);
gulp.task('default', ['watch']);