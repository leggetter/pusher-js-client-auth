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
  var returnHash = {};
  var channelDataStr = '';
  if (channelData) {
    channelData = JSON.stringify(channelData);
    channelDataStr = ':' + channelData;
    returnHash.channel_data = channelData;
  }
  var stringToSign = socketId + ':' + channel + channelDataStr;
  returnHash.auth = this.key + ':' + crypto.createHmac('sha256', this.secret).update(stringToSign).digest('hex');
  return returnHash;
};

module.exports = ClientAuthorizer;
