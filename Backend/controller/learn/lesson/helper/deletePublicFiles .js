const fs = require("fs").promises;
const path = require("path");

/**
 * Delete a list of normalized URLs from your public folder.
 * @param {string[]} removedPaths  Array of strings like "/learn/images/xyz.webp"
 * @returns {Promise<void>}
 */
async function deletePublicFiles(removedPaths) {
  // Base directory where your static files live
  const PUBLIC_DIR = path.resolve(__dirname, "../../../../public");

  const deletions = removedPaths.map(async (urlPath) => {
    // Only allow deleting from the /learn/ subfolder
    if (!urlPath.startsWith("/learn/")) {
      console.warn(`Skipping unsafe path deletion: ${urlPath}`);
      return;
    }

    // Build the absolute filesystem path
    const absPath = path.join(PUBLIC_DIR, urlPath);

    try {
      await fs.unlink(absPath);
      console.log(`Deleted: ${absPath}`);
    } catch (err) {
      // E.g. file didn’t exist, or a permissions issue
      console.error(`Failed to delete ${absPath}:`, err.message);
    }
  });

  await Promise.all(deletions);
}

module.exports = { deletePublicFiles };
