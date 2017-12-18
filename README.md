# CoinHive [![Build Status](https://travis-ci.org/cazala/coin-hive.svg?branch=master)](https://travis-ci.org/cazala/coin-hive)

Mine cryptocurrencies [Monero (XMR)](https://getmonero.org/) and [Electroneum (ETN)](http://electroneum.com/) using [CoinHive](https://coinhive.com/) from node.js

**New:** Now you can [run this miner on any stratum based pool](https://github.com/cazala/coin-hive#faq).

**New 2:** Now you can [mine Electroneum (ETN)](https://github.com/cazala/coin-hive#can-i-mine-other-cryptocurrency-than-monero-xmr).

**Need a proxy?** check [coin-hive-stratum](https://github.com/cazala/coin-hive-stratum).

## Install

```
npm install -g coin-hive
```

## Usage

```js
const CoinHive = require('coin-hive');

(async () => {
  // Create miner
  const miner = await CoinHive('ZM4gjqQ0jh0jbZ3tZDByOXAjyotDbo00'); // CoinHive's Site Key

  // Start miner
  await miner.start();

  // Listen on events
  miner.on('found', () => console.log('Found!'));
  miner.on('accepted', () => console.log('Accepted!'));
  miner.on('update', data =>
    console.log(`
    Hashes per second: ${data.hashesPerSecond}
    Total hashes: ${data.totalHashes}
    Accepted hashes: ${data.acceptedHashes}
  `)
  );

  // Stop miner
  setTimeout(async () => await miner.stop(), 60000);
})();
```

## CLI

Usage:

```
coin-hive ZM4gjqQ0jh0jbZ3tZDByOXAjyotDbo00
```

Options:

```
  --username        Set a username for the miner
  --interval        Interval between updates (logs)
  --port            Port for the miner server
  --host            Host for the miner server
  --threads         Number of threads for the miner
  --throttle        The fraction of time that threads should be idle
  --proxy           Proxy socket 5/4, for example: socks5://127.0.0.1:9050
  --puppeteer-url   URL where puppeteer will point to, by default is miner server (host:port)
  --miner-url       URL of CoinHive's JavaScript miner, can be set to use a proxy
  --dev-fee         A donation to the developer, the default is 0.001 (0.1%)
  --pool-host       A custom stratum pool host, it must be used in combination with --pool-port
  --pool-port       A custom stratum pool port, it must be used in combination with --pool-host
  --pool-pass       A custom stratum pool password, if not provided the default one is 'x'
```

## API

* `CoinHive(siteKey[, options])`: Returns a promise of a `Miner` instance. It requires a [CoinHive Site Key](https://coinhive.com/settings/sites). The `options` object is optional and may contain the following properties:

  * `username`: Set a username for the miner. See [CoinHive.User](https://coinhive.com/documentation/miner#coinhive-user).

  * `interval`: Interval between `update` events in ms. Default is `1000`.

  * `port`: Port for the miner server. Default is `3002`.

  * `host`: Host for the miner server. Default is `localhost`.

  * `threads`: Number of threads. Default is `navigator.hardwareConcurrency` (number of CPU cores).

  * `throttle`: The fraction of time that threads should be idle. Default is `0`.

  * `proxy`: Puppeteer's proxy socket 5/4 (ie: `socks5://127.0.0.1:9050`).

  * `launch`: The options that will be passed to `puppeteer.launch(options)`. See [Puppeteer Docs](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions).

  * `pool`: This allows you to use a different pool. It has to be an [Stratum](https://en.bitcoin.it/wiki/Stratum_mining_protocol) based pool. This object must contain the following properties:

    * `host`: The pool's host.

    * `port`: The pool's port.

    * `pass`: The pool's password. If not provided the default one is `"x"`.

  * `devFee`: A donation to send to the developer. Default is `0.001` (0.1%).

* `miner.start()`: Connect to the pool and start mining. Returns a promise that will resolve once the miner is started.

* `miner.stop()`: Stop mining and disconnect from the pool. Returns a promise that will resolve once the miner is stopped.

* `miner.kill()`: Stop mining, disconnect from the pool, shutdown the server and close the headless browser. Returns a promise that will resolve once the miner is dead.

* `miner.on(event, callback)`: Specify a callback for an event. The event types are:

  * `update`: Informs `hashesPerSecond`, `totalHashes` and `acceptedHashes`.

  * `open`: The connection to our mining pool was opened. Usually happens shortly after miner.start() was called.

  * `authed`: The miner successfully authed with the mining pool and the siteKey was verified. Usually happens right after open.

  * `close`: The connection to the pool was closed. Usually happens when miner.stop() was called.

  * `error`: An error occured. In case of a connection error, the miner will automatically try to reconnect to the pool.

  * `job`: A new mining job was received from the pool.

  * `found`: A hash meeting the pool's difficulty (currently 256) was found and will be send to the pool.

  * `accepted`: A hash that was sent to the pool was accepted.

* `miner.rpc(methodName, argsArray)`: This method allows you to interact with the CoinHive miner instance. It returns a Promise that resolves the the value of the remote method that was called. The miner instance API can be [found here](https://coin-hive.com/documentation/miner#miner-is-running). Here's an example:

```js
var miner = await CoinHive('SITE_KEY');
await miner.rpc('isRunning'); // false
await miner.start();
await miner.rpc('isRunning'); // true
await miner.rpc('getThrottle'); // 0
await miner.rpc('setThrottle', [0.5]);
await miner.rpc('getThrottle'); // 0.5
```

## Environment Variables

All the following environment variables can be used to configure the miner from the outside:

* `COINHIVE_SITE_KEY`: CoinHive's Site Key

* `COINHIVE_USERNAME`: Set a username to the miner. See [CoinHive.User](https://coinhive.com/documentation/miner#coinhive-user).

* `COINHIVE_INTERVAL`: The interval on which the miner reports an update

* `COINHIVE_THREADS`: Number of threads

* `COINHIVE_THROTTLE`: The fraction of time that threads should be idle

* `COINHIVE_PORT`: The port that will be used to launch the server, and where puppeteer will point to

* `COINHIVE_HOST`: The host that will be used to launch the server, and where puppeteer will point to

* `COINHIVE_PUPPETEER_URL`: In case you don't want to point puppeteer to the local server, you can use this to make it point somewhere else where the miner is served (ie: `COINHIVE_PUPPETEER_URL=http://coin-hive.herokuapp.com`)

* `COINHIVE_MINER_URL`: Set the CoinHive JavaScript Miner url. By defualt this is `https://coinhive.com/lib/coinhive.min.js`. You can set this to use a [CoinHive Proxy](https://github.com/cazala/coin-hive-proxy).

* `COINHIVE_PROXY`: Puppeteer's proxy socket 5/4 (ie: `COINHIVE_PROXY=socks5://127.0.0.1:9050`)

* `COINHIVE_DEV_FEE`: A donation to the developer, the default is 0.001 (0.1%).

* `COINHIVE_POOL_HOST`: A custom stratum pool host, it must be used in combination with `COINHIVE_POOL_PORT`.

* `COINHIVE_POOL_PORT`: A custom stratum pool port, it must be used in combination with `COINHIVE_POOL_HOST`.

* `COINHIVE_POOL_PASS`: A custom stratum pool password, if not provided the default one is 'x'.

## FAQ

#### Can I run this on a different pool than CoinHive's?

Yes, you can run this on any pool based on the [Stratum Mining Protocol](https://en.bitcoin.it/wiki/Stratum_mining_protocol).

```js
const CoinHive = require('coin-hive');
(async () => {
  const miner = await CoinHive('<YOUR-MONERO-ADDRESS>', {
    pool: {
      host: 'la01.supportxmr.com',
      port: 3333,
      pass: '<YOUR-PASSWORD-FOR-POOL>' // default 'x' if not provided
    }
  });
  await miner.start();
  miner.on('found', () => console.log('Found!'));
  miner.on('accepted', () => console.log('Accepted!'));
  miner.on('update', data =>
    console.log(`
    Hashes per second: ${data.hashesPerSecond}
    Total hashes: ${data.totalHashes}
    Accepted hashes: ${data.acceptedHashes}
  `)
  );
})();
```

Now your CoinHive miner would be mining on `supportXMR.com` pool, using your monero address.

You can also do this using the CLI:

```
coin-hive <YOUR-MONERO-ADDRESS> --pool-host=la01.supportxmr.com --pool-port=3333 --pool-pass=<YOUR-PASSWORD-FOR-POOL>
```

#### Can I mine other cryptocurrency than Monero (XMR)?

Yes, you can also mine [Electroneum (ETN)](http://electroneum.com/).

You can go get you ETN wallet from [MineKitten.io](http://minekitten.io/#wallet) if you don't have one.

Yes, you can run this on any pool based on the [Stratum Mining Protocol](https://en.bitcoin.it/wiki/Stratum_mining_protocol).

```js
const CoinHive = require('coin-hive');
const miner = await CoinHive('<YOUR-ELECTRONEUM-ADDRESS>', {
  pool: {
    host: 'etnpool.minekitten.io',
    port: 3333
  }
});
miner.start();
```

Now your CoinHive miner would be mining on `MineKitten.io` pool, using your electroneum address.

You can also do this using the CLI:

```
coin-hive <YOUR-ELECTRONEUM-ADDRESS> --pool-host=etnpool.minekitten.com --pool-port=3333
```

One of the features of Electroneum is that it has a difficulty of `100`, while CoinHive's is `256`.

#### Can I run this on Heroku?

No, it violates the [TOS](https://www.heroku.com/policy/aup).

Also, since Puppeteer requires some additional dependencies that aren't included on the Linux box that Heroku spins up for you, you need to go to your app's `Settings > Buildpacks` first and add this url:

```
https://github.com/jontewks/puppeteer-heroku-buildpack
```

On the next deploy, your app will also install the dependencies that Puppeteer needs to run.

#### Can I run this on Docker?

You'll need to install the latest version of Chrome and Puppeteer's dependencies in your Dockerfile:

```
FROM node:8-slim

# Install latest chrome and puppeteer dependencies
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - &&\
sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list' &&\
apt-get update &&\
apt-get install -y google-chrome-unstable gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

# Install coin-hive
RUN npm i -g coin-hive --unsafe-perm=true --allow-root

# Run coin-hive
CMD coin-hive <site-key>
```

#### Which version of Node.js do I need?

Node v8+

## Troubleshooting

#### I'm having errors on Ubuntu/Debian

Install these dependencies:

```
sudo apt-get -y install gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget libxext6
```

#### I'm getting an Error: EACCES: permission denied when installing the package

Try installing the package using this:

```
sudo npm i -g coin-hive --unsafe-perm=true --allow-root
```

#### An error occured Failed to launch chrome!

Try changing chromium's executable path to `/usr/bin/chromium-browser`, like this:

```js
const miner = await CoinHive('site-key', {
  launch: {
    executablePath: '/usr/bin/chromium-browser',
    args: ['--disable-setuid-sandbox', '--no-sandbox']
  }
});
```

For more info check issue [#54](https://github.com/cazala/coin-hive/issues/54)

## Disclaimer

This project is not endorsed by or affiliated with `coinhive.com` in any way.

## Support

This project pre-configured for a 0.1% donation. This can be easily toggled off programatically, from the CLI, or via environment variables. If you do so, but you still want to show your support, you can buy me a beer with [magic internet money](https://i.imgur.com/mScSiOo.jpg):

```
BTC: 16ePagGBbHfm2d6esjMXcUBTNgqpnLWNeK
ETH: 0xa423bfe9db2dc125dd3b56f215e09658491cc556
LTC: LeeemeZj6YL6pkTTtEGHFD6idDxHBF2HXa
XMR: 46WNbmwXpYxiBpkbHjAgjC65cyzAxtaaBQjcGpAZquhBKw2r8NtPQniEgMJcwFMCZzSBrEJtmPsTR54MoGBDbjTi2W1XmgM
```

<3
