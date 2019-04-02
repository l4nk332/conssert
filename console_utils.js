function colorFns() {
  const RESET_COLOR = '\x1b[0m'
  const COLOR = {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    crimson: '\x1b[38m'
  }

  return Object.entries(COLOR).reduce((acc, [color, code]) => {
    acc[color] = text => `${code}${text}${RESET_COLOR}`.trim()
    return acc
  }, {})
}

const COLOR = colorFns()

function constructBanner(baseMsg, padding = 2) {
  const extraPad = padding * 2
  const repeatAmount = baseMsg.length + extraPad

  const border = `=${'='.repeat(repeatAmount)}=`
  const spacer = `|${' '.repeat(repeatAmount)}|`
  const message = `|${' '.repeat(padding)}${baseMsg}${' '.repeat(padding)}|`

  return `
${border}
${spacer}
${message}
${spacer}
${border}
`
}

function portBanner(port) {
  const {yellow, blue} = COLOR
  const filledA = 'A'.repeat('Conssert'.length)
  const filledB = 'B'.repeat(`http:\/\/localhost:${port}`.length)
  const baseMsg = constructBanner(`🔊 ${filledA} is running on --> ${filledB}`, 5)
  const replacedA = baseMsg.replace(filledA, yellow('Conssert'))
  const banner = replacedA.replace(filledB, blue(`http:\/\/localhost:${port}`))
  return banner
}

function helpOptions() {
  const HELP = `
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
`.trim()

  return `\n${HELP}\n`
}

function logAndExit(msg) {
  console.log(msg)
  process.exit()
}

function packageVersion() {
  const packageJson = require('./package.json')
  return `v${packageJson.version}`
}

module.exports = {
  constructBanner,
  portBanner,
  helpOptions,
  logAndExit,
  packageVersion,
  ...COLOR
}
