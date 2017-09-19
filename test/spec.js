const expect = require('expect');
const defaults = require('../config/defaults.js')
const CoinHive = require('../src');

describe('Coin-Hive', async () => {

  it('should mine', async () => {
    var miner = await CoinHive(defaults.SITE_KEY);
    await miner.start();
    return new Promise(resolve => {
      miner.on('update', async (data) => {
        if (data.acceptedHashes > 0) {
          await miner.kill();
          resolve();
        }
      })
    });
  });

  it('should do RPC', async () => {
    var miner = await CoinHive(defaults.SITE_KEY);
    let isRunning = await miner.rpc('isRunning');
    expect(isRunning).toBe(true);
    await miner.stop();
    isRunning = await miner.rpc('isRunning');
    expect(isRunning).toBe(false);
    let threads = await miner.rpc('getNumThreads');
    expect(typeof threads).toBe('number');
    await miner.rpc('setNumThreads', [2]);
    threads = await miner.rpc('getNumThreads');
    expect(threads).toBe(2);
    await miner.kill();
  });
});
