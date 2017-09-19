const server = require('./server');
const puppeteer = require('./puppeteer');
const defaults = require('../config/defaults');

module.exports = async function getRunner(siteKey, options = {port: defaults.PORT, host: defaults.HOST, interval: defaults.INTERVAL, threads: defaults.THREADS}) {
  const miner = await new Promise((resolve, reject) => {
    const minerServer = server().listen(options.port, options.host, async (err) => {
      if (err) {
        return reject(err);
      }

      return resolve(
        puppeteer({
          siteKey,
          interval: options.interval,
          port: options.port,
          host: options.host,
          threads: options.threads,
          server: minerServer
        })
      );
    });
  });
  await miner.init();
  return miner;
}
