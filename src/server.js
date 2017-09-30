var Express = require('express');
var path = require('path');
var fs = require('fs');
var defaults = require('../config/defaults');

module.exports = function getServer(minerUrl = defaults.minerUrl) {
  var html = `<script src=\"${minerUrl}\"></script><script src=\"/miner.js\" /></script>`;
  var app = new Express();
  app.get('/miner.js', (req, res) => {
    var minerPath = path.resolve(__dirname, './miner.js');
    fs.createReadStream(minerPath).pipe(res.header('content-type', 'application/json'));
  });
  app.use('*', (req, res) => res.send(html));
  return app;
}