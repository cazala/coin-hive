const EventEmitter = require('events');
const puppeteer = require('puppeteer');
const defaults = require('../config/defaults');

class Puppeteer extends EventEmitter {

  constructor(siteKey, interval, port, host, server) {
    super();
    this.inited = false;
    this.dead = false;
    this.siteKey = siteKey;
    this.interval = interval;
    this.host = host;
    this.port = port;
    this.server = server;
    this.browser = null;
    this.page = null;
  }

  async getBrowser() {
    if (this.browser) {
      return this.browser;
    }
    this.browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    return this.browser;
  }

  async getPage() {
    if (this.page) {
      return this.page;
    }
    this.page = await (await this.getBrowser()).newPage();
    return this.page;
  }

  async init() {

    if (this.dead) {
      throw new Error('This miner has been killed');
    }

    if (this.inited) {
      return this.page;
    }

    const page = await this.getPage();
    const url = process.env.PUPPETEER_URL || `http://${this.host}:${this.port}`;
    await page.goto(url);
    await page.exposeFunction('found', () => this.emit('found'));
    await page.exposeFunction('accepted', () => this.emit('accepted'));
    await page.exposeFunction('update', (data, interval) => this.emit('update', data, interval));
    await page.evaluate((siteKey, interval) => window.init(siteKey, interval), this.siteKey, this.interval);

    this.inited = true;

    return this.page;
  }

  async start() {
    await this.init();
    return this.page.evaluate(() => window.start());
  }

  async stop() {
    await this.init();
    return this.page.evaluate(() => window.stop());
  }

  async kill() {
    try {
      await this.stop();
    } catch (e) { console.log('Error stopping miner', e) }
    try {
      const browser = await this.getBrowser();
      await browser.close();
    } catch (e) { console.log('Error closing browser', e) }
    try {
      if (this.server) {
        this.server.close();
        console.log('server closed')
      }
    } catch (e) { console.log('Error closing server', e) }
    this.dead = true;
  }

  async rpc(method, args) {
    await this.init();
    return this.page.evaluate((method, args) => window.miner[method].apply(window.miner, args), method, args)
  }
}

module.exports = function getPuppeteer(options = {}) {

  const siteKey = process.env.SITE_KEY || options.siteKey || defaults.SITE_KEY;
  const interval = process.env.INTERVAL || options.interval || defaults.INTERVAL;
  const port = process.env.PUPPETEER_PORT || process.env.PORT || options.port || defaults.PORT;
  const host = process.env.PUPPETEER_HOST || process.env.HOST || options.host || defaults.HOST;
  const server = options.server || null;

  return new Puppeteer(siteKey, interval, port, host, server);
}