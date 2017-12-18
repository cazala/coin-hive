const EventEmitter = require('events');
const puppeteer = require('puppeteer');

class Puppeteer extends EventEmitter {
  constructor({
    siteKey,
    interval,
    host,
    port,
    server,
    threads,
    throttle,
    proxy,
    username,
    url,
    devFee,
    pool,
    launch
  }) {
    super();
    this.inited = false;
    this.dead = false;
    this.host = host;
    this.port = port;
    this.server = server;
    this.browser = null;
    this.page = null;
    this.proxy = proxy;
    this.url = url;
    this.options = { siteKey, interval, threads, throttle, username, devFee, pool };
    this.launch = launch || {};
  }

  async getBrowser() {
    if (this.browser) {
      return this.browser;
    }
    const options = Object.assign(
      {
        args: this.proxy ? ['--no-sandbox', '--proxy-server=' + this.proxy] : ['--no-sandbox']
      },
      this.launch
    );
    this.browser = await puppeteer.launch(options);
    return this.browser;
  }

  async getPage() {
    if (this.page) {
      return this.page;
    }
    const browser = await this.getBrowser();
    this.page = await browser.newPage();
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
    const url = process.env.COINHIVE_PUPPETEER_URL || this.url || `http://${this.host}:${this.port}`;
    await page.goto(url);
    await page.exposeFunction('emitMessage', (event, message) => this.emit(event, message));
    await page.exposeFunction('update', (data, interval) => this.emit('update', data, interval));
    await page.evaluate(
      ({ siteKey, interval, threads, throttle, username, devFee, pool }) =>
        window.init({ siteKey, interval, threads, throttle, username, devFee, pool }),
      this.options
    );

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
    this.on('error', () => {});
    try {
      await this.stop();
    } catch (e) {
      console.log('Error stopping miner', e);
    }
    try {
      const browser = await this.getBrowser();
      await browser.close();
    } catch (e) {
      console.log('Error closing browser', e);
    }
    try {
      if (this.server) {
        this.server.close();
      }
    } catch (e) {
      console.log('Error closing server', e);
    }
    this.dead = true;
  }

  async rpc(method, args) {
    await this.init();
    return this.page.evaluate((method, args) => window.miner[method].apply(window.miner, args), method, args);
  }
}

module.exports = function getPuppeteer(options = {}) {
  return new Puppeteer(options);
};
