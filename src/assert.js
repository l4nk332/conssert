import { deepEquals, negateIf, getFrameLocation } from './utils.js'

export default function assert(logger, lhs) {
  return {
    _negated: false,
    logFailures({expected, received, result, message}) {
      if (!result) {
        const frameLocation = getFrameLocation(2)
        logger.log({
          expected,
          received,
          message,
          frameLocation
        })
      }
    },
    isTrue() {
      const result = negateIf(this._negated, lhs === true)

      this.logFailures({
        result,
        expected: true,
        received: lhs,
        message:  `Expected true but received ${lhs}`
      })

      return result
    },
    isFalse() {
      const result = negateIf(this._negated, lhs === false)

      this.logFailures({
        result,
        expected: false,
        received: lhs,
        message:  `Expected false but received ${lhs}`
      })

      return result
    },
    equalTo(rhs) {
      const result = negateIf(this._negated, deepEquals(lhs, rhs))

      this.logFailures({
        result,
        expected: rhs,
        received: lhs,
        message:  `Expected ${rhs} but received ${lhs}`
      })

      return result
    },
    sameAs(rhs) {
      const result = negateIf(this._negated, Object.is(lhs, rhs))

      this.logFailures({
        result,
        expected: lhs,
        received: rhs,
        message:  `Expected a shared reference between ${lhs} and ${rhs}`
      })

      return result
    },
    instanceOf(rhs) {
      const result = negateIf(this._negated, lhs instanceof rhs)

      this.logFailures({
        result,
        expected: lhs,
        received: rhs,
        message:  `Expected ${lhs} to be an instance of ${rhs}`
      })

      return result
    },
    get not() {
      this._negated = !this._negated
      return this
    }
  }
}
