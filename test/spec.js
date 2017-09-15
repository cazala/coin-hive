const CoinHive = require('../src');
describe('Coin-Hive', () => {
  it('should mine', async () => {
    var miner = await CoinHive();
    await miner.start();
    return new Promise(resolve => {
      miner.on('update', (data) => {
        if (data.acceptedHashes > 0) {
          miner.stop();
          resolve();
        }
      })
    });
  })
});