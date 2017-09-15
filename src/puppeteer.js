var EventEmitter = require('events');
var puppeteer = require('puppeteer');
var defaults = require('../config/defaults');

// Browser
var browser = null;
var getBrowser = async () => {
  if (browser) {
    return browser;
  }
  browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  return browser;
}

// Page
var page = null;
var getPage = async () => {
  if (page) {
    return page;
  }
  page = (await getBrowser()).newPage();
  return page;
}

class Puppeteer extends EventEmitter {

  constructor(siteKey, interval, port, host) {
    super();
    this.siteKey = siteKey;
    this.interval = interval;
    this.host = host;
    this.port = port;
  }

  async init() {
    if (this.page) {
      return this.page;
    }

    const page = await getPage();
    await page.goto(`http://${this.host}:${this.port}`);
    await page.exposeFunction('found', () => this.emit('found'));
    await page.exposeFunction('accepted', () => this.emit('accepted'));
    await page.exposeFunction('update', (data, interval) => this.emit('update', data, interval));
    await page.evaluate((siteKey, interval) => window.init(siteKey, interval), this.siteKey, this.interval);

    this.page = page;
    return this.page;
  }

  async start() {
    await this.init();
    this.page.evaluate(() => window.start());
  }

  async stop() {
    await this.init();
    this.page.evaluate(() => window.stop());
  }
}

module.exports = function getPuppeteer(options = {}) {

  var siteKey = options.siteKey || defaults.SITE_KEY;
  var interval = options.interval || defaults.INTERVAL;
  var port = options.port || defaults.PORT;
  var host = options.host || defaults.HOST;

  return new Puppeteer(siteKey, interval, port, host);
}