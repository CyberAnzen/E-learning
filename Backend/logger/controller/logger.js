// logger.js - Worker thread file

const { parentPort } = require('worker_threads');
const fs = require('fs');
const path = require('path');

// Configuration
const ACCESS_LOG_PATH = path.join(__dirname, 'access.log');
const ERROR_LOG_PATH = path.join(__dirname, 'error.log');
const FLUSH_INTERVAL_MS = 10 * 1000; // flush every 10s
const MAX_BUFFER_BYTES = 1024 * 1024; // 1 MB
const MAX_BUFFER_ENTRIES = 1000;

let buffers = {
  access: [],
  error: []
};
let bufferBytes = {
  access: 0,
  error: 0
};

let flushing = false;
let shutdownRequested = false;

function entrySize(entry) {
  return Buffer.byteLength(JSON.stringify(entry) + '\n');
}

function enqueue(entry) {
  const size = entrySize(entry);

  const isError = entry.error_log;
  const type = isError ? 'error' : 'access';
  if(isError){

  }
  else{
  buffers['access'].push(entry);
  bufferBytes['access'] += size;

  if (
    bufferBytes['access'] >= MAX_BUFFER_BYTES ||
    buffers['access'].length >= MAX_BUFFER_ENTRIES
  ) {
    scheduleFlush(0);
  }
  }


}

function writeBatchToFile(filePath, lines) {
  return new Promise((resolve, reject) => {
    fs.appendFile(filePath, lines, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

async function flushBuffer() {
  if (flushing) return;
  if (!buffers.access.length && !buffers.error.length) return;

  flushing = true;

  const toFlush = {
    access: buffers.access,
    error: buffers.error
  };
  const toFlushBytes = { ...bufferBytes };

  // Reset buffers
  buffers = { access: [], error: [] };
  bufferBytes = { access: 0, error: 0 };

  try {
    if (toFlush.access.length) {
      const accessLines = toFlush.access.map(e => JSON.stringify(e)).join('\n') + '\n';
      await writeBatchToFile(ACCESS_LOG_PATH, accessLines);
    }
    if (toFlush.error.length) {
      const errorLines = toFlush.error.map(e => JSON.stringify(e)).join('\n') + '\n';
      await writeBatchToFile(ERROR_LOG_PATH, errorLines);
    }

    parentPort.postMessage({
      type: 'flushComplete',
      count: {
        access: toFlush.access.length,
        error: toFlush.error.length
      },
      bytes: toFlushBytes
    });
  } catch (err) {
    console.error('Failed to write logs:', err);
    // Requeue failed writes
    buffers.access = toFlush.access.concat(buffers.access);
    buffers.error = toFlush.error.concat(buffers.error);
    bufferBytes.access += toFlushBytes.access;
    bufferBytes.error += toFlushBytes.error;
  } finally {
    flushing = false;
  }
}

let scheduledFlushTimer = null;
function scheduleFlush(delay = FLUSH_INTERVAL_MS) {
  if (scheduledFlushTimer) return;
  scheduledFlushTimer = setTimeout(async () => {
    scheduledFlushTimer = null;
    await flushBuffer();
    if (shutdownRequested && !buffers.access.length && !buffers.error.length) {
      parentPort.postMessage({ type: 'shutdownComplete' });
      process.exit(0);
    }
  }, delay);
}

setInterval(() => {
  if (buffers.access.length || buffers.error.length) scheduleFlush(0);
}, FLUSH_INTERVAL_MS);

parentPort.on('message', (msg) => {
  if (!msg || !msg.type) return;

  if (msg.type === 'log' && msg.entry) {
    enqueue(msg.entry);
  } else if (msg.type === 'shutdown') {
    shutdownRequested = true;
    (async () => {
      await flushBuffer();
      if (!buffers.access.length && !buffers.error.length && !flushing) {
        parentPort.postMessage({ type: 'shutdownComplete' });
        process.exit(0);
      } else {
        scheduleFlush(0);
      }
    })();
  }
});

process.on('uncaughtException', (err) => {
  console.error('Logger worker uncaughtException:', err);
  try {
    if (buffers.access.length) {
      const lines = buffers.access.map(e => JSON.stringify(e)).join('\n') + '\n';
      fs.appendFileSync(ACCESS_LOG_PATH, lines);
    }
    if (buffers.error.length) {
      const lines = buffers.error.map(e => JSON.stringify(e)).join('\n') + '\n';
      fs.appendFileSync(ERROR_LOG_PATH, lines);
    }
  } catch (e) {
    console.error('Failed to append sync logs on crash:', e);
  }
  process.exit(1);
});
