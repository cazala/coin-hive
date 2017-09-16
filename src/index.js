const server = require('./server');
const puppeteer = require('./puppeteer');
const defaults = require('../config/defaults');

module.exports = async function getRunner(
  siteKey = defaults.SITE_KEY,
  interval = defaults.INTERVAL,
  port = defaults.PORT,
  host = defaults.HOST
) {
  const miner = await new Promise((resolve, reject) => {
    var minerServer = server().listen(
      process.env.SERVER_PORT || process.env.PORT || port,
      process.env.SERVER_HOST || process.env.HOST || host,
      async (err) => {
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
      }
    );
  });
  await miner.init();
  return miner;
}
