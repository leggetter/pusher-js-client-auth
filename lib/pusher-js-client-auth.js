( function( Pusher ) {
  var ClientAuthorizer = require( './ClientAuthorizer' );

  Pusher.authorizers.client = function(socketId, callback){
    var authorizer = new ClientAuthorizer( this.options.clientAuth );
    var hash = authorizer.auth( socketId, this.channel.name, null );
    callback( null, hash );
  };

} )( window.Pusher );
