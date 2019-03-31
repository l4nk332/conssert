function toRegex(str) {
  return RegExp(str)
}

function toRegexes(arr) {
  return arr.map(toRegex)
}

function isIgnoredPath(ignoreRegexes = [], pathname) {
  return ignoreRegexes.some(ignoreRegex => ignoreRegex.test(pathname))
}

module.exports = {
  toRegexes,
  isIgnoredPath
}
