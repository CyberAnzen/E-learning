module.exports = function requestLogger(logInBackground) {
  return (req, res, next) => {
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
      try {
        let bytes=Buffer.byteLength(JSON.stringify(log) + '\n');
        console.log(bytes);
        
        logInBackground(log);
      } catch (e) {
        console.error('Failed to enqueue log:', e);
      }
    });
    next();
  };
};