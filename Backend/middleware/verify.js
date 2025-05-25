const jwt = require('jsonwebtoken');

// Ensure you have your secret in an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const verify = (req, res, next) => {
  // Option 1: Token in cookies
  let token = req.cookies.token;

//   // Option 2: Token in Authorization header (optional)
//   if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     token = req.headers.authorization.split(' ')[1];
//   }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    // Attach user data to request object
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { verify };
