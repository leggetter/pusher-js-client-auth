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

  it( 'should be possible to call auth', function() {
    var authorizer = new ClientAuthorizer( {
      key: 'test-key',
      secret: 'test-secret'
    } );
    var authToken = authorizer.auth( 'some-socket-id', 'some-channel-name' );

    expect( authToken ).toBeDefined();
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
