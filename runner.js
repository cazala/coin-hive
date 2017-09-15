var server = require('./server')();
var puppeteer = require('./puppeteer')();
var defaults = require('./defaults');

var port = process.env.PORT || defaults.PORT;
var host = process.env.HOST || defaults.HOST;

server.listen(port, host, async (err) => {
  if (err) {
    console.log('SERVER ERROR:', err);
    return;
  }
  console.log(`listening on port ${port}`);

  await puppeteer.init();
  await puppeteer.start();

  puppeteer.on('update', (data, interval) => console.log(data, interval))
  puppeteer.on('found', () => console.log('found!'))
  puppeteer.on('accepted', () => console.log('accepted!'))
});

