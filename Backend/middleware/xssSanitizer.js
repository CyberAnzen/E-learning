const sanitizeHtml = require('sanitize-html');

function sanitizeInput(obj, config) {
  for (let key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = sanitizeHtml(obj[key], config);
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeInput(obj[key], config); // recursive for nested objects
    }
  }
}

// Middleware generator
const xssSanitizer = (options = {}) => {
  // Default: block all tags and attributes
  const config = {
    allowedTags: options.allowedTags || [],
    allowedAttributes: options.allowedAttributes || {},
    allowedSchemes: options.allowedSchemes || ['http', 'https', 'mailto']
  };

  return (req, res, next) => {
    if (req.body) sanitizeInput(req.body, config);
    if (req.query) sanitizeInput(req.query, config);
    if (req.params) sanitizeInput(req.params, config);

    next();
  };
};

module.exports = xssSanitizer;


// This middleware can be used to sanitize inputs in Express.js applications
// Example usage in a route

/* router.post(
  '/rich-text',
  xssSanitizer({
    allowedTags: ['b', 'i', 'a', 'p', 'ul', 'li'], this is a list of allowed tags
    allowedAttributes: {
      a: ['href']  // only allow href attribute for <a> tags 
    }
  }),
  controller
); */