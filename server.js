const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

const { portBanner, blue, red } = require('./console_utils.js')
const { buildHtml } = require('./response_utils.js')

const hostname = '127.0.0.1'
const port = 3000

const CURRENT_PATH = '.'
// TODO: Use this to resolve node_module path
// const MODULE_PATH = path.dirname(require.resolve('conssert'))
const MODULE_PATH = '.'

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, {'Content-type': 'text/html'})
    res.end(buildHtml(CURRENT_PATH))
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
