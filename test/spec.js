const expect = require('expect');
const CoinHive = require('../src');

describe('Coin-Hive', async () => {

  it('should mine', async () => {
    var miner = await CoinHive();
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
    var miner = await CoinHive();
    let isRunning = await miner.rpc('isRunning');
    expect(isRunning).toBe(false);
    await miner.start();
    isRunning = await miner.rpc('isRunning');
    expect(isRunning).toBe(true);
    let threads = await miner.rpc('getNumThreads');
    expect(typeof threads).toBe('number');
    await miner.rpc('setNumThreads', [2]);
    threads = await miner.rpc('getNumThreads');
    expect(threads).toBe(2);
    await miner.kill();
  });
});