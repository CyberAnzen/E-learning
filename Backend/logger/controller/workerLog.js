module.exports = function createLogWorker(loggerWorker) {
  function logInBackground(entry) {
    loggerWorker.postMessage({ type: 'log', entry });
  }

  loggerWorker.on('error', (err) => {
    console.error('Logger worker error:', err);
  });

  loggerWorker.on('message', (msg) => {
    if (msg && msg.type === 'flushComplete') {
      console.log('Logger worker flushed logs (batch).');
    }
  });

  return logInBackground;
};