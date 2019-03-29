function isIgnoredPath(ignorePaths = [], pathname) {
  return ignorePaths.some(ignoredPath => pathname.includes(ignoredPath))
}

module.exports = {
  isIgnoredPath
}
