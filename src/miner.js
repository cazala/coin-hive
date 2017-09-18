var miner = null;
var intervalId = null;
var intervalMs = null;

// Init miner
function init(siteKey, threads, interval = 1000) {
  // Create miner
  miner = new CoinHive.Anonymous(siteKey);

  miner.setNumThreads(threads)

  // Listen on events
  miner.on('found', function () {
    /* Hash found */
    console.log('found!')
    window.found && window.found();
  })
  miner.on('accepted', function () {
    /* Hash accepted by the pool */
    console.log('accepted!')
    window.accepted && window.accepted();
  })

  // Set Interval
  intervalMs = interval;
}

// Start miner
function start() {
  if (miner) {
    console.log('started!');
    miner.start();
    intervalId = setInterval(function () {
      var update = {
        hashesPerSecond: miner.getHashesPerSecond(),
        totalHashes: miner.getTotalHashes(),
        acceptedHashes: miner.getAcceptedHashes(),
        threads: miner.getNumThreads(),
      }
      console.log('update:', update)
      window.update && window.update(update, intervalMs);
    }, intervalMs);
    return intervalId;
  }
  return null;
}

// Stop miner
function stop() {
  if (miner) {
    console.log('stopped!');
    miner.stop();
    if (intervalId) {
      clearInterval(intervalId);
    }
    intervalId = null;
  }
}
