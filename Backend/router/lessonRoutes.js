const express = require("express");
const router = express.Router();
const { createLesson } = require("../controller/learn/lesson/createLesson");
const { getLesson } = require("../controller/learn/lesson/getLesson");
const { deleteLesson } = require("../controller/learn/lesson/deleteLesson");
const { updateLesson } = require("../controller/learn/lesson/updateLesson");
const createImage = require("../controller/learn/lesson/media/createImage");
const createVideos = require("../controller/learn/lesson/media/createVideo");
const { singleFileUpload } = require("../middleware/dynamicFileUploadPath");
const { Auth } = require("../middleware/Auth");
const xssSanitizer = require("../middleware/xssSanitizer");
const safeHtmlConfig = {
  allowedTags: [
    // Text formatting
    'b', 'i', 'strong', 'em', 'u', 's', 'strike', 'sub', 'sup', 'code', 'pre', 'kbd', 'var',
    'mark', 'small', 'abbr', 'cite', 'q', 'time',
    
    // Paragraphs and blocks
    'p', 'div', 'span', 'blockquote', 'hr', 'br',
    
    // Headings
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    
    // Lists
    'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    
    // Links and media
    'a', 'img', 'figure', 'figcaption', 'picture', 'source',
    
    // Tables
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
    
    // Semantic elements
    'header', 'footer', 'main', 'section', 'article', 'aside', 'nav',
    'details', 'summary', 'address',
    
    // Forms (safe form elements only)
    'form', 'label', 'input', 'button', 'select', 'option', 'optgroup',
    'textarea', 'fieldset', 'legend',
    
    // Other safe elements
    'progress', 'meter', 'output', 'datalist'
  ],
  
  allowedAttributes: {
    // Global attributes
    '*': ['class', 'id', 'title', 'aria-*', 'data-*', 'role'],
    
    // Link-specific attributes
    'a': ['href', 'target', 'rel', 'name', 'download', 'hreflang', 'type'],
    
    // Image-specific attributes
    'img': ['src', 'alt', 'width', 'height', 'loading', 'srcset', 'sizes'],
    'source': ['src', 'srcset', 'type', 'media', 'sizes'],
    
    // Form element attributes
    'input': ['type', 'name', 'value', 'placeholder', 'required', 'disabled', 
              'readonly', 'maxlength', 'min', 'max', 'step', 'pattern', 'accept'],
    'textarea': ['name', 'placeholder', 'required', 'disabled', 'readonly', 
                 'rows', 'cols', 'maxlength'],
    'button': ['type', 'name', 'value', 'disabled'],
    'select': ['name', 'required', 'disabled', 'multiple', 'size'],
    'option': ['value', 'selected', 'disabled'],
    
    // Media attributes
    'video': ['src', 'width', 'height', 'controls', 'autoplay', 'loop', 'muted', 'poster'],
    'audio': ['src', 'controls', 'autoplay', 'loop', 'muted'],
    
    // Table attributes
    'table': ['border', 'cellpadding', 'cellspacing'],
    'td': ['colspan', 'rowspan'],
    'th': ['colspan', 'rowspan', 'scope']
  },
  
  // Always explicitly block these
  disallowedTags: [
    'script', 'noscript', 'style', 'iframe', 'frame', 'frameset', 'object',
    'embed', 'applet', 'base', 'meta', 'link', 'title', 'head', 'html', 'body'
  ],
  
  // Block all event handlers and dangerous attributes
  disallowedAttributes: [
    'on*', 'style', 'xmlns', 'formaction', 'background', 'poster',
    'srcdoc', 'sandbox', 'allowfullscreen', 'allowpaymentrequest'
  ],
  
  // URL schemes
  allowedSchemes: ['http', 'https', 'mailto', 'tel', 'data'],
  allowedSchemesByTag: {
    'img': ['http', 'https', 'data'],
    'source': ['http', 'https', 'data']
  },
  
  // Other security settings
  allowVulnerableTags: false,
  enforceHtmlBoundary: true
};

router.get("/:ClassificationId/:LessonId", 
  Auth(),
  xssSanitizer(),
  getLesson
);

//Strictly Admin Protected Routes
router.post(
  "/createImage",
  Auth({ requireAdmin: true }),
  singleFileUpload("temp/uploads/images/", "image"),
  xssSanitizer(),
  createImage
);
router.post(
  "/createVideo",
  Auth({ requireAdmin: true }),
  singleFileUpload("temp/uploads/videos/", "video"),
  xssSanitizer(),
  createVideos
);

router.post("/create", 
  Auth({ requireAdmin: true }),
  xssSanitizer(safeHtmlConfig),
   createLesson);

router.delete("/delete/:id",
   Auth({ requireAdmin: true }), 
    xssSanitizer(),
   deleteLesson
  );

router.patch("/update",
   Auth({ requireAdmin: true }), 
   xssSanitizer(safeHtmlConfig),
   updateLesson
  );

module.exports = router;
