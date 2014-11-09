var gulp = require('gulp');
var browserify = require('gulp-browserify');

gulp.task('build', function() {
    gulp.src( 'lib/pusher-js-client-auth.js' )
        .pipe( browserify() )
        .pipe( gulp.dest( './dist' ) );
} );
