const server = require('./server');
const puppeteer = require('./puppeteer');
const defaults = require('../config/defaults');

module.exports = async function getRunner(siteKey, userName, constructorOptions = defaults) {
  const options = Object.assign({}, defaults, constructorOptions)

  const miner = await new Promise((resolve, reject) => {
    const minerServer = server().listen(options.port, options.host, async (err) => {
      if (err) {
        return reject(err);
      }

      return resolve(
        puppeteer({
          siteKey,
          userName,
          interval: options.interval,
          port: options.port,
          host: options.host,
          threads: options.threads,
          server: minerServer,
          proxy: options.proxy
        })
      );
    });
  });
  await miner.init();
  return miner;
}
