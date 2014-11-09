( function( Pusher ) {
  console.warn( 'By using pusher-js client authentication you are exposing ' +
                'your application secret. DO NOT do this in production.' );

  var ClientAuthorizer = require( './ClientAuthorizer' );
  ClientAuthorizer.setUpPusher( Pusher );

} )( window.Pusher );
