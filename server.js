const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

const { portBanner } = require('./console_utils.js')

const hostname = '127.0.0.1'
const port = 3000

const CURRENT_PATH = '.'
// TODO: Use this to resolve node_module path
const MODULE_PATH = path.dirname(require.resolve('conssert'))

function collectFilePaths(dirPath) {
  return (
    fs.readdirSync(dirPath)
      .reduce((collected, child) => {
        const childPath = path.join(dirPath, child)

        const isDirectory = fs.lstatSync(childPath).isDirectory()
        const isTestFile = child.endsWith('.test.js')
        const isNodeModules = child.includes('node_modules')

        if (!(isDirectory || isTestFile) || isNodeModules) return collected

        return collected.concat(
          isDirectory
            ? collectFilePaths(childPath)
            : [childPath]
        )
      }, [])
  )
}

function buildHtml() {
  const testPaths = collectFilePaths(CURRENT_PATH)
  const testFiles = testPaths.map(testPath => (
    `<script type='module' src='${testPath}'></script>`
  )).join('')

  return (
    `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Conssert Browser Testing</title>
        </head>
        <body>
          <script type='module' src='./node_modules/conssert/src/index.js'></script>
          ${testFiles}
          <script type='module' src='./node_modules/conssert/src/runner.js'></script>
        </body>
      </html>
    `
  )
}

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, {'Content-type': 'text/html'})
    res.end(buildHtml('.'))
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
    if (pathname.endsWith('.test.js')) {
      console.log(`Found Test File: ${pathname}`)
    }
    res.writeHead(200, {'Content-type': mimeMap[ext] || 'text/plain'})
    res.end(fs.readFileSync(pathname))
    return
  } else {
    res.writeHead(404)
    res.end(`File ${pathname} not found!`)
  }
})



server.listen(port, hostname, () => {
  console.log(portBanner(port))
})
