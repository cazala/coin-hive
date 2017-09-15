# Coin-Hive

Mine [Monero (XMR)](https://getmonero.org/) using [Coin-Hive](https://coin-hive.com/) from NodeJS.

## Install

```
npm install -g coin-hive
```

## Usage

```js
var CoinHive = require('coin-hive');
(async () => {

  // Create miner
  var miner = await CoinHive('ZM4gjqQ0jh0jbZ3tZDByOXAjyotDbo00'); // Coin-Hive's Site Key

  // Start miner
  await miner.start();

  // Listen on events
  miner.on('found', () => console.log('Found!'))
  miner.on('accepted', () => console.log('Accepted!'))
  miner.on('update', (data) => console.log(`
Hashes per second: ${data.hashesPerSecond}
Total hashes: ${data.totalHashes}
Accepted hashes: ${data.acceptedHashes}
  `));

  // Stop miner
  setTimeout(async () => await miner.stop(), 60000);
})();
```

## CLI

```
coin-hive <site-key>
```

## Requisites

+ Node v8+

