var crypto = require( 'crypto' );

/**
 * Used for authenticating channel subscriptions entirely on the client.
 * If the client is a web browser then this can be highly insecure and it
 * IS NOT recommended that you do this. You SHOULD DEFINITELY NOT DO THIS
 * in production.
 *
 * @param {Object} options
 */
function ClientAuthorizer( options ) {
  if( !options.key ) {
    throw new Error( 'a "key" must be provided' );
  }

  if( !options.secret ) {
    throw new Error( 'a "secret" must be provided' );
  }

  this.key = options.key;
  this.secret = options.secret;
}

/**
 * Authenticate the subscription
 *
 * @param {String} socketId
 *    The socket id for the connection
 * @param {String} channel
 *    The name of the channel being subscribed to
 * @param {Object} channelData
 *    Additional channel data to be included in the authentication signature
 */
ClientAuthorizer.prototype.auth = function(socketId, channel, channelData) {
  if( channel.indexOf( 'presence-' ) === 0 ) {

    if( !channelData ) {
      throw Error( '"channelData" is required when authenticating a Presence channel' );
    }
    if( !channelData.user_id ) {
      throw Error( '"channelData.user_id" must be set when authenticating a Presence channel' );
    }
  }

  var stringToSign = ClientAuthorizer.createStringToSign(socketId, channel, channelData);
  
  var returnHash = {};
  
  if(channelData) {
    returnHash.channel_data = channelData;
  }
  
  returnHash.auth = this.key + ':' + crypto.createHmac('sha256', this.secret).update(stringToSign).digest('hex');
  return returnHash;
};

// Static Helpers

/**
 * Creates the string that is to be signed with the Pusher application secret.
 *
 * @param {String} socketId The socket ID for the connection to Pusher from the client.
 * @param {String} channel The name of the channel being subscribed to.
 * @param {Object} channelData Optional. Data for the channel.
 *                 Only relevant if a presence channel.
 */
ClientAuthorizer.createStringToSign = function(socketId, channel, channelData) {
  var channelDataStr = '';
  var stringToSign = socketId + ':' + channel
  if (channelData) {
    channelData = JSON.stringify(channelData);
    stringToSign += ':' + channelData;
  }
  return stringToSign;
};

/**
 * Setup up the client authoriser.
 *
 * @param {Pusher} Pusher
 *    The Pusher global reference.
 */
ClientAuthorizer.setUpPusher = function( Pusher ) {
  Pusher.authorizers.client = ClientAuthorizer.clientAuth;
};

/**
 * Perform the client authentication. Called by Pusher library when authTransport
 * is set to 'client'.
 *
 * When this is executed it will be scoped so that `this` reference an instance
 * of `Pusher.Channel.Authorizer`.
 *
 * @param {String} socketId
 *    The id of the socket being authenticated to subscribe to the channel.
 * @param {Function} callback
 *    The callback to be executed when the authentication has completed.
 */
ClientAuthorizer.clientAuth = function( socketId, callback ){
  var authorizer = ClientAuthorizer.createAuthorizer( this.options.clientAuth );
  var channelData = null;
  if( this.options.clientAuth.user_id ) {
    channelData = {
      user_id: this.options.clientAuth.user_id,
      user_info: this.options.clientAuth.user_info
    };
  }
  var hash = authorizer.auth( socketId, this.channel.name, channelData );
  callback( null, hash );
};

/**
 * Factory function for creating a ClientAuthorizer.
 *
 * @param {Object} clientAuthOption
 *    The client authentication options.
 * @returns ClientAuthorizer
 */
ClientAuthorizer.createAuthorizer = function( clientAuthOptions ) {
  var authorizer = new ClientAuthorizer( clientAuthOptions );
  return authorizer;
};

module.exports = ClientAuthorizer;
