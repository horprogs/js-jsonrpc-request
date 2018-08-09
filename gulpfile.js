const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('babel', () =>
    gulp.src('src/index.js')
        .pipe(babel())
        .pipe(gulp.dest('dist'))
);

gulp.task('watch', function () {
    gulp.watch(['./src/**/*.js'], ['babel']);
});


gulp.task('default', ['watch']);

gulp.task('build', ['babel']);