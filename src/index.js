const server = require('./server');
const puppeteer = require('./puppeteer');
const defaults = require('../config/defaults');

module.exports = async function getRunner({siteKey, interval, port, host}) {
  const miner = await new Promise((resolve, reject) => {
    const minerServer = server().listen(port, host, async (err) => {
      if (err) {
        return reject(err);
      }

      return resolve(
        puppeteer({
          siteKey,
          interval,
          port,
          host,
          server: minerServer
        })
      );
    });
  });
  await miner.init();
  return miner;
}
