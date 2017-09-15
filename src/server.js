var Express = require('express');
var path = require('path');
var fs = require('fs');

var html = `
  <script src=\"https://coin-hive.com/lib/coinhive.min.js\"></script>
  <script src=\"/miner.js\" /></script>
`;

module.exports = function getServer() {
  var app = new Express();
  app.get('/miner.js', (req, res) => {
    var minerPath = path.resolve(__dirname, './miner.js');
    fs.createReadStream(minerPath).pipe(res.header('content-type', 'application/json'));
  });
  app.use('*', (req, res) => res.send(html));
  return app
}