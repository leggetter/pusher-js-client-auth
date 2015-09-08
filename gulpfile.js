var gulp = require('gulp');
var browserify = require('gulp-browserify');
var Server = require('karma').Server

gulp.task('build', function() {
    gulp.src( 'lib/pusher-js-client-auth.js' )
        .pipe( browserify() )
        .pipe( gulp.dest( './dist' ) );
} );

gulp.task('test', function (done) {
  var server = new Server({ configFile: __dirname + '/karma.conf.js', singleRun: true}, done);
  server.start();
});
