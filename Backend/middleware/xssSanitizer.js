const sanitizeHtml = require('sanitize-html');

function sanitizeInput(obj, config, debug = false, path = '') {
  // Skip if obj is null or not an object
  if (obj === null || typeof obj !== 'object') {
    return;
  }

  if (debug) {
    console.log(`Sanitizing input at path ${path || 'root'}:`, JSON.stringify(obj, null, 2));
  }

  // Handle arrays and objects differently
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const currentPath = `${path}[${i}]`;
      if (typeof obj[i] === 'string') {
        const original = obj[i];
        obj[i] = sanitizeHtml(obj[i], config);
        if (debug && original !== obj[i]) {
          console.log(`Sanitized array element "${currentPath}":`, {
            before: original,
            after: obj[i]
          });
        }
      } else if (typeof obj[i] === 'object' && obj[i] !== null) {
        sanitizeInput(obj[i], config, debug, currentPath);
      }
    }
  } else {
    // Handle regular objects
    for (const key in obj) {
      // Safely check property (works for Objects and Arrays)
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (typeof obj[key] === 'string') {
          const original = obj[key];
          obj[key] = sanitizeHtml(obj[key], config);
          if (debug && original !== obj[key]) {
            console.log(`Sanitized field "${currentPath}":`, {
              before: original,
              after: obj[key]
            });
          }
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeInput(obj[key], config, debug, currentPath);
        }
      }
    }
  }
}

const xssSanitizer = (options = {}) => {
  const debug = options.debug !== false;
  delete options.debug;

  const config = {
    allowedTags: options.allowedTags || [],
    allowedAttributes: options.allowedAttributes || {},
    disallowedTagsMode: 'discard',
    allowedSchemes: options.allowedSchemes || ['http', 'https', 'mailto', 'tel'],
    disallowedTags: ['script', 'noscript', 'style', 'iframe', 'frame'],
    disallowedAttributes: ['onclick', 'onload', 'onerror', 'onmouseover', 'style'],

    transformTags: {
      'a': (tagName, attribs) => {
        if (attribs.href && /^(javascript|data):/i.test(attribs.href)) {
          delete attribs.href;
        }
        return { tagName, attribs };
      }
    },
    ...options
  };

  return (req, res, next) => {
    // Skip if the body hasn't been parsed yet (like in file uploads)
    if (req.body === undefined) {
      if (debug) console.log('Skipping sanitization - body not parsed yet');
      return next();
    }

    if (debug) {
      console.log(`\n=== Sanitizing ${req.method} request to ${req.path} ===`);
    }

    try {
      sanitizeInput(req.body, config, debug, 'body');
      sanitizeInput(req.query, config, debug, 'query');
      sanitizeInput(req.params, config, debug, 'params');
      
      if (debug) {
        console.log('Sanitization completed successfully');
        console.log('=======================================\n');
      }
    } catch (error) {
      console.error('Sanitization error:', error);
      return res.status(400).json({ error: 'Invalid input data' });
    }

    next();
  };
};

module.exports = xssSanitizer;