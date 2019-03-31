const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

const parseArgs = require('./argument_parser.js')
const { isIgnoredPath, toRegexes } = require('./ignore_utils.js')
const { portBanner, blue, red } = require('./console_utils.js')
const { partial } = require('./func_utils.js')
const { buildHtml } = require('./response_utils.js')

const ARGS = parseArgs(process.argv)

const hostname = '127.0.0.1'
const port = ARGS.PORT || 3000

const LOCAL_DEV = ARGS.LOCAL_DEV

if (LOCAL_DEV) console.log('\nRunning in local development mode...\n')

const IGNORE_REGEXES = ARGS.IGNORE ? toRegexes(ARGS.IGNORE) : []
const shouldIgnore = partial(isIgnoredPath, IGNORE_REGEXES)

const CURRENT_PATH = '.'
const MODULE_PATH = LOCAL_DEV ? '.' : path.dirname(require.resolve('conssert'))

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, {'Content-type': 'text/html'})
    res.end(buildHtml(CURRENT_PATH, MODULE_PATH, shouldIgnore))
    return
  }

  const parsedUrl = url.parse(req.url)
  const pathname = `.${parsedUrl.pathname}`

  const ext = path.parse(pathname).ext
  const mimeMap = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
  }

  const fileExists = (
    fs.existsSync(pathname) &&
    !fs.statSync(pathname).isDirectory()
  )

  if (fileExists) {
    console.log(pathname.endsWith('.test.js') ? blue(pathname) : pathname)

    res.writeHead(200, {'Content-type': mimeMap[ext] || 'text/plain'})
    res.end(fs.readFileSync(pathname))
    return
  } else {
    console.log(`File Not Found: ${red(pathname)}`)
    res.writeHead(404)
    res.end(`File ${pathname} not found!`)
  }
})



server.listen(port, hostname, () => {
  console.log(portBanner(port))
})
