require("dotenv").config();
const BASE_URL = process.env.BASE_UR;
// mediaSanitizer.js

/**
 * Replace any absolute URL pointing at /learn/... with just the path.
 * E.g.
 *   <img src="http://localhost:4000/learn/images/foo.webp">
 * becomes
 *   <img src="/learn/images/foo.webp">
 *
 * Works on both <img> and <video> tags (and any other src="...") in your HTML string.
 *
 * @param {string} html
 * @returns {string}
 */
function normalizeMediaUrls(html) {
  return html.replace(
    /(src=["'])(?:https?:\/\/[^/]+)?(\/learn\/[^"']+)(["'])/gi,
    (_match, prefix, path, suffix) => `${prefix}${path}${suffix}`
  );
}

/**
 * Re-adds the BASE_URL in front of any src="/learn/..."
 * E.g.
 *   <img src="/learn/images/foo.webp">
 * becomes
 *   <img src="http://localhost:4000/learn/images/foo.webp">
 *
 * @param {string} html
 * @returns {string}
 */
function denormalizeMediaUrls(html) {
  return html.replace(
    /(src=["'])(\/learn\/[^"']+)(["'])/gi,
    (_match, prefix, path, suffix) => `${prefix}${BASE_URL}${path}${suffix}`
  );
}

module.exports = {
  normalizeMediaUrls,
  denormalizeMediaUrls,
};
