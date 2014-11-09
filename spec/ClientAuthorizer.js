var ClientAuthorizer = require( '../lib/ClientAuthorizer.js' );

describe( 'ClientAuthorizer', function() {

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

} );
