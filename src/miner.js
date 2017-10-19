var miner = null;
var intervalId = null;
var intervalMs = null;

// Init miner
function init({ siteKey, interval = 1000, threads = null, username }) {
  // Create miner
  if (!username) {
    miner = new CoinHive.Anonymous(siteKey);
  } else {
    miner = new CoinHive.User(siteKey, username);
  }

  if (threads > 0) {
    miner.setNumThreads(threads);
  }

  miner.on("open", function(message) {
    console.log("open", message);
    if (window.emitMessage) {
      window.emitMessage("open", message);
    }
  });

  miner.on("authed", function(message) {
    console.log("authed", message);
    if (window.emitMessage) {
      window.emitMessage("authed", message);
    }
  });

  miner.on("close", function(message) {
    console.log("close", message);
    if (window.emitMessage) {
      window.emitMessage("close", message);
    }
  });

  miner.on("error", function(message) {
    console.log("error", message);
    if (window.emitMessage) {
      window.emitMessage("error", message);
    }
  });

  miner.on("job", function(message) {
    console.log("job", message);
    if (window.emitMessage) {
      window.emitMessage("job", message);
    }
  });

  miner.on("found", function(message) {
    console.log("found", message);
    if (window.emitMessage) {
      window.emitMessage("found", message);
    }
  });

  miner.on("accepted", function(message) {
    console.log("accepted", message);
    if (window.emitMessage) {
      window.emitMessage("accepted", message);
    }
  });

  // Set Interval
  intervalMs = interval;
}

// Start miner
function start() {
  if (miner) {
    console.log("started!");
    miner.start();
    intervalId = setInterval(function() {
      var update = {
        hashesPerSecond: miner.getHashesPerSecond(),
        totalHashes: miner.getTotalHashes(),
        acceptedHashes: miner.getAcceptedHashes(),
        threads: miner.getNumThreads(),
        autoThreads: miner.getAutoThreadsEnabled()
      };
      console.log("update:", update);
      window.update && window.update(update, intervalMs);
    }, intervalMs);
    return intervalId;
  }
  return null;
}

// Stop miner
function stop() {
  if (miner) {
    console.log("stopped!");
    miner.stop();
    if (intervalId) {
      clearInterval(intervalId);
    }
    intervalId = null;
  }
}
