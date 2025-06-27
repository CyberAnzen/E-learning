function normalizeImagePaths(images) {
  return images.map((url) => {
    const match = url.match(/(\/learn\/.+)$/);
    return match ? match[1] : url;
  });
}

module.exports = {
  normalizeImagePaths,
};
