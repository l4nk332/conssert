# Conssert

A **zero-config** testing framework that runs in your browser.

<p align='center'><img src='img/conssert_logo.png' alt='Conssert Logo' /></p>

Conssert aims to:

- Provide a clean, simple interface for writing tests around
  client-side facing code.
- Allow for tested code to use new, browser-supported JS syntax without
  needing to transpile for testing (as with node-based testing frameworks).
- Make setting up a testing environment as simple and painless as
  possible with **zero configuration necessary**.

## Installation

Install with npm:

```
npm install -D conssert
```

or with yarn:

```
yarn add -D conssert
```

## Usage: Writing a Test

Once you've installed conssert you can start creating your first test
module to be run:

```javascript
// translators.test.js

import { isValidCamelCase, camel2Kabob } from './translators.js'

new Suite('isValidCamelCase')
  .tests([
    ['Should return false for invalid camel cased inputs', assert => {
      assert(isValidCamelCase('Invalid-')).equalTo(false)
      assert(isValidCamelCase('invalid-camel-')).equalTo(false)
    }],
    ['Should return true for valid camel cased inputs', assert => {
      assert(isValidCamelCase('isValid')).equalTo(true)
      assert(isValidCamelCase('isValidAgain')).equalTo(true)
    }]
  ])

new Suite('camel2Kabob')
  .tests([
    ['Should return identity of value passed in if not camel case', assert => {
      assert(camel2Kabob('is_value')).equalTo('is_value')
      assert(camel2Kabob('is-value')).equalTo('is-value')
    }],
    ['Should return value translated to kabob case', assert => {
      assert(camel2Kabob('isValue')).equalTo('is-value')
      assert(camel2Kabob('isValueAgain')).equalTo('is-value-again')
    }]
  ])
```

As you can see above first we create a file with a `.test.js` extension.

We then import the code we'd like to test from `./translators.js` and
create instances of the `Suite` object (available globally), providing
it with a list of test cases to run.

Each test case should first include a description of the test itself
followed by the function which, provided with an `assert` function,
will do any assetions necessary.

> You can find more detailed documentation around the assetion methods
  available and other testing interfaces below.

## Usage: Running the Test Harness

To get conssert up and running simply run:

```
$ conssert
```

This will spin up an HTTP server that runs on `http://localhost:3000`.

When you navigate to the page conssert will sift through the files
in your project and serve up all the ones ending with a `.test.js`
extension.

You will see the test results output in both the browser console:

[placeholder image of browser console]()

As well as in the rendered HTML page:

[placeholder image of HTML output]()

At any point you can click `Re-run` or simply refresh the page to run
the tests again.

> A `watch mode` is supported as well in which the tests will
  automatically re-run when changes are detected. See section below.

## CLI Options

Listed below are the options you can provide conssert from the terminal:

```
conssert [options]

  -h, --help         Will print out this message and list out
                     CLI options available.

  -i, --ignore       JS structured regex to ignore.
                     Multiple can be set by separating with a space.
                     Use single quotes to prevent shell expansion.

  -l, --local-dev    Allows for local development of conssert
                     by properly configuring directory

                     paths - default: false
  -p, --port         Port conssert will run on and server
                     files from - default: 3000

  -q, --quiet        Report errors only rather than standard output
                     of tests and assets being served. - default: false

  -v, --version      Output the version number of conssert being used.

  -w, --watch        Will automatically re-run tests when file
                     modifications are detected. If --ignore option is
                     used, the files matching given pattern(s) will not
                     be watched.
```

## Conssert API Examples

Below you can find an example usage of the API provided by conssert
followed by a breakdown of each key component:

```javascript
new Suite('TestSuiteName')
  .before(fn)
  .beforeEach(fn)
  .tests([
    ['isTrue / isFalse Test Case', assert => {
      assert(true).isTrue()
      assert(true).not().isFalse()

      assert(false).not().isFalse()
      assert(false).not().isTrue()
    }],
    ['equalTo Test Case', assert => {
      assert('abc').equalTo('abc')
      assert('abc').not().equalTo('ABC')

      assert([1, 2]).equalTo([1, 2])
      assert([1, 2]).not().equalTo([2, 1])

      assert({x: 1, y: {z: 2}}).equalTo({x: 1, y: {z: 2}})
      assert({x: 1, y: {z: 2}}).not().equalTo({x: 1, y: 2})
    }],
    ['sameAs Test Case', assert => {
      const x = [1, 2, 3]
      assert(x).sameAs(x)
      assert(x).not().sameAs([1, 2, 3])
    }],
    ['instanceOf Test Case', assert => {
      function A() {}
      assert(new A()).instanceOf(A)
      function B() {}
      assert(new A()).not().instanceOf(B)
    }]
  ])
  .afterEach(fn)
  .after(fn)
```

Snippet | Description
------- | -----------
`new Suite('TestSuiteName')` | Instantiates a new test suite with the name `TestSuiteName`. This object is available globally.
`Suite.before(fn)` | Will run the provided function before any test cases run for the given test suite.
`Suite.after(fn)` | Will run the provided function after all test cases have run for the given test suite.
`Suite.beforeEach(fn)` | Will run the provided function before each test case.
`Suite.afterEach(fn)` | Will run the provided function after each test case.
`Suite.tests([...])` | Registers all the test cases under the given test suite.
`['Test Case Description', assert => {}]` | A single test case with a description of `Test Case Description` and an test case assertion function to run.
`assert(v).isFalse()` | Will assert that `v` is false.
`assert(v).isTrue()` | Will assert that `v` is true.
`assert(v).equalTo(z)` | Behaves as a deep equal comparison for primitive and objects alike. In this case we are asserting `v` is equal to `z`.
`assert(v).sameAs(z)` | Should be used for reference types when one wants to assert that two objects share the same reference. In this case we are asserting that `v` and `z` both share the same reference.
`assert(v).instanceOf(z)` | Will assert that `v` is an instance of `z`
`assert(v).not().equalTo(z)` | Usage of `not()` will negate the set assertion, essentially flipping the logic. It can prefix any of the other assetion methods listed above. In this case we are asserting `v` is not equal to `z`.
