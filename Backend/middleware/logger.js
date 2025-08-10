const logger =(req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const log = {
      timestamp: new Date().toISOString(),
      client_ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      method: req.method,
      url: req.originalUrl,
      http_version: `HTTP/${req.httpVersion}`,
      status_code: res.statusCode,
      response_time_ms: Date.now() - start,
      bytes_sent: parseInt(res.getHeader('Content-Length')) || 0,
      referrer: req.get('referer') || '',
      user_agent: req.get('user-agent') || '',
      host: req.hostname || req.get('host') || '',
      protocol: req.protocol
    };

    // Fire-and-forget
    try {
      logInBackground(log);
    } catch (e) {
      // Worker postMessage rarely throws; if it does, avoid crashing the request
      console.error('Failed to enqueue log:', e);
    }
  });

  next();
}

// Basic error handler so we still log error responses
const errorLogger =(err, req, res, next) => {
  const errLog = {
    timestamp: new Date().toISOString(),
    client_ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    method: req.method,
    url: req.originalUrl,
    error_message: err.message,
    stack: err.stack,
    status_code: 500,
    user_agent: req.get('user-agent') || ''
  };

  try { logInBackground(errLog); } 
  catch (e) {
     console.error('Failed to enqueue error log:', e); 
}
  res.status(500).json({ error: 'Internal Server Error' });
}


module.exports = {
  logger,
  errorLogger
};
