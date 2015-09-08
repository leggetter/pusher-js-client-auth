var ClientAuthorizer = require( '../lib/ClientAuthorizer.js' );

var fakeAuthorizer = {
  options: {
    clientAuth: {
      key: 'some key',
      secret: 'some secret',
      user_id: 'some-user',
      user_info: {}
    }
  },

  channel: {
    name: 'some-channel'
  }
};

describe( 'ClientAuthorizer', function() {

  it( 'should setup client authorizer on Pusher.authorizers', function() {
    var fakePusher = {};
    fakePusher.authorizers = {};

    ClientAuthorizer.setUpPusher( fakePusher );

    expect( fakePusher.authorizers.client ).toBeDefined();
    expect( fakePusher.authorizers.client ).toBe( ClientAuthorizer.clientAuth );
  } );

  it( 'should pass socketId, channel name and channelData to instance auth function', function() {

    spyOn( ClientAuthorizer, 'createAuthorizer' ).and.callThrough();

    ClientAuthorizer.clientAuth.call( fakeAuthorizer, 'socket-id', function( error, data ) {} );

    expect( ClientAuthorizer.createAuthorizer ).toHaveBeenCalledWith( fakeAuthorizer.options.clientAuth );

  } );

  it( 'should pass channelData if a user_id is present on clientAuth.options', function() {
    var fakeClientAuthorizer = {
      auth: function() {}
    };
    spyOn( ClientAuthorizer, 'createAuthorizer' ).and.returnValue( fakeClientAuthorizer );
    spyOn( fakeClientAuthorizer, 'auth' );

    var socketId = 'socket-id';
    ClientAuthorizer.clientAuth.call( fakeAuthorizer, socketId, function( error, data ) {} );

    expect( fakeClientAuthorizer.auth )
      .toHaveBeenCalledWith(
        socketId,
        fakeAuthorizer.channel.name,
        jasmine.objectContaining( {
          user_id: fakeAuthorizer.options.clientAuth.user_id,
          user_info: fakeAuthorizer.options.clientAuth.user_info
        } )
      );
  } );

  it( 'should be possible to construct a new instance', function() {
    var authorizer = new ClientAuthorizer( {
      key: 'test-key',
      secret: 'test-secret'
    } );
  } );

  it( 'should throw an Error if no key is supplied', function() {
    var noKey = function () {
      var authorizer = new ClientAuthorizer( {
        secret: 'some secret'
      } );
    };

    expect( noKey ).toThrow();
  } );

  it( 'should throw an Error if no secret is supplied', function() {
    var noSecret = function () {
      var authorizer = new ClientAuthorizer( {
        key: 'some key'
      } );
    };

    expect( noSecret ).toThrow();
  } );
  
  it( 'should build a string to sign from channel name and socket ID in the expected format', function() {
    var channelName = 'private-channel';
    var socketId = 'some_socket_id';
    
    var expectedString = socketId + ':' + channelName;
    var actualString = ClientAuthorizer.createStringToSign(socketId, channelName);

    expect( expectedString ).toBe( actualString );
  } );
  
  it( 'should build a string to sign from channel name, socket ID and channel data in the expected format', function() {
    var channelName = 'private-channel';
    var socketId = 'some_socket_id';
    var channelData = {
      user_id: 'some_user_id',
      user_info: {
        name: 'Phil'
      }
    };
    
    var expectedString = socketId + ':' + channelName + ':' + JSON.stringify(channelData);
    var actualString = ClientAuthorizer.createStringToSign(socketId, channelName, channelData);

    expect( expectedString ).toBe( actualString );
  } );

  it( 'should be possible to call auth', function() {
    var authorizer = new ClientAuthorizer( {
      key: 'test-key',
      secret: 'test-secret'
    } );
    var authToken = authorizer.auth( 'some-socket-id', 'some-channel-name' );

    expect( authToken ).toBeDefined();
  } );
  
  it( 'should set the auth.channel_data value to a String', function() {
    var authorizer = new ClientAuthorizer( {
      key: 'test-key',
      secret: 'test-secret'
    } );
    var authToken = authorizer.auth( 'some-socket-id', 'presence-channel-name', {
      user_id: 'leggetter',
      user_info: {
        some: 'thing'
      }
    } );

    expect( typeof(authToken.channel_data) ).toBe('string');
  } );

  it( 'should require channelData to be passed when authenticating a presence channel', function () {
    var authorizer = new ClientAuthorizer( {
      key: 'test-key',
      secret: 'test-secret'
    } );

    var authPresenceChannel = function() {
      authorizer.auth( 'some-socket-id', 'presence-' );
    };

    expect( authPresenceChannel ).toThrow();
  } );

  it( 'should required the channelData.user_id to be set when authenticating a presence channel', function() {
    var authorizer = new ClientAuthorizer( {
      key: 'test-key',
      secret: 'test-secret'
    } );

    var authPresenceChannel = function() {
      authorizer.auth( 'some-socket-id', 'presence-', {} );
    };

    expect( authPresenceChannel ).toThrow();
  } );

} );
