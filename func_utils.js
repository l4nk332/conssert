function partial(fn, ...args) {
  return function(...rest) {
    return fn(...args, ...rest)
  }
}

module.exports = {
  partial
}
