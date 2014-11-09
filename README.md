# pusher-js Client Authentication Plugin

Pusher is built with security in mind. Because of this you need to authenticate subscriptions to `private-` and `presence-` channels against a server. However, *sometimes* you don't want to do this. This plugin provides a way of authenticating on the client (in the browser).

However, in order to do this you will expose your application secret. You **should not expose your application secret** in production.

## Prerequisites

This is a plugin for the official [Pusher](http://pusher.com) JavaScript library and compatible with the latest 2.2.x release. Make sure you have a working implementation up and running.

Documentation and configuration options are explained at the [Pusher-js Github page](https://github.com/pusher/pusher-js)

## Usage

Load the plugin after including the Pusher library

    <script src="//js.pusher.com/2.2/pusher.min.js"></script>
    <script src="dist/pusher-js-client-auth.js"></script>

## Configuration

This plugin comes with a few extra configuration parameters. The whole list is available at the [Pusher-js Github page](https://github.com/pusher/pusher-js#configuration)

    var pusher = new Pusher(APP_KEY, {
        authTransport: 'client',
        clientAuth: {
          key: APP_KEY
          secret: APP_SECRET
        }
    });

### `clientAuth.key` (String)

Required field. This is duplicating the `APP_KEY`. However, there is no nice way of fetching the value through the existing API so duplication seems to be the best option for now.

### `clientAuth.secret` (String)

Required field. This is your application secret. *Remember: do not deploy this to production*.

## TODO

* Presence subscriptions won't work as `channel_data` is required. Need to define a way of passing user information and additional data
