// errorLogger.js
module.exports = function errorLogger(logInBackground) {
  return (err, req, res, next) => {
    const statusCode = res.statusCode && res.statusCode !== 200
      ? res.statusCode
      : 500; // default to 500 for unhandled errors

    const errLog = {
      timestamp: new Date().toISOString(),
      client_ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      method: req.method,
      url: req.originalUrl,
      error_message: err.message||res.message||"internal server error",
      stack: err.stack,
      status_code: statusCode,
      user_agent: req.get('user-agent') || ''
    };

    try {
      logInBackground(errLog); // worker will route this to error.log
    } catch (e) {
      console.error('Failed to enqueue error log:', e);
    }

   // res.status(statusCode).json({ error: 'Internal Server Error' });
  };
};
