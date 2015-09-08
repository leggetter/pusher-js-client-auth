# pusher-js Client Authentication Plugin

Pusher is built with security in mind. Because of this you need to authenticate subscriptions to `private-` and `presence-` channels against a server. However, *sometimes* you don't want to do this. This plugin provides a way of authenticating on the client (in the browser).

However,  **you SHOULD NOT expose your application secret in production**. If you have a real production use case for this then please [drop me an email](mailto:phil@leggetter.co.uk).

## Prerequisites

This is a plugin for the official [Pusher](http://pusher.com) JavaScript library and compatible with the latest 2.2.x release. Make sure you have a working implementation up and running.

Documentation and configuration options are explained at the [Pusher-js Github page](https://github.com/pusher/pusher-js)

## Usage

Load the plugin after including the Pusher library

    <script src="//js.pusher.com/2.2/pusher.min.js"></script>
    <script src="dist/pusher-js-client-auth.js"></script>

## Configuration

This plugin comes with a few extra configuration parameters. The whole list is available at the [Pusher-js Github page](https://github.com/pusher/pusher-js#configuration)

```js
var pusher = new Pusher(APP_KEY, {
    authTransport: 'client',
    clientAuth: {
      key: APP_KEY,
      secret: APP_SECRET,
      user_id: USER_ID,
      user_info: {}
    }
});
```

### `clientAuth.key` (String)

Required field. This is duplicating the `APP_KEY`. However, there is no nice way of fetching the value through the existing API so duplication seems to be the best option for now.

### `clientAuth.secret` (String)

Required field. This is your application secret. *Remember: do not deploy this to production*.

### `user_id` (String)

The `user_id` used when authenticating Presence channels. This user id will be used to uniquely identify the user.

### `user_info` (Object)

The `user_info` used when authenticating Presence channels. The information supplied here will be available to anybody subscribed to the presence channel.

```js
var pusher = new Pusher(APP_KEY, {
    authTransport: 'client',
    clientAuth: {
      key: APP_KEY
      secret: APP_SECRET,
      user_id: 'leggetter',
      user_info: {
        twitter: 'leggetter'
        github: 'leggetter'
        bio: 'Developer Evangelist'
      }
    }
});
```

## Library Development

### Setup

Install Gulp globally.

```
$ npm install --global gulp
```

Install module dev dependencies.

```
$ npm install
```

### Testing

```
gulp test
```
