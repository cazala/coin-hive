var server = require('./server');
var puppeteer = require('./puppeteer');
var defaults = require('../config/defaults');

module.exports = async function getRunner(siteKey = defaults.SITE_KEY) {

  var port = process.env.PORT || defaults.PORT;
  var host = process.env.HOST || defaults.HOST;

  var miner = await new Promise((resolve, reject) => {
    server().listen(port, host, async (err) => {
      if (err) {
        return reject(err);
      }
      return resolve(
        puppeteer({
          siteKey,
          port,
          host,
          interval: defaults.INTERVAL
        }));
    });
  });
  await miner.init();
  return miner;
}
