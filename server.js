const http = require('http')
const fs = require('fs')
const path = require('path')

const hostname = '127.0.0.1'
const port = 3000

function collectFilePaths(dirPath) {
  return (
    fs.readdirSync(dirPath)
      .reduce((collected, child) => {
        const childPath = path.join(dirPath, child)

        const childIsDirectory = fs.lstatSync(childPath).isDirectory()
        const childIsTestFile = child.endsWith('.test.js')

        if (!(childIsDirectory || childIsTestFile)) return collected

        return collected.concat(
          childIsDirectory
            ? collectFilePaths(childPath)
            : [childPath]
        )
      }, [])
  )
}

function buildHtml() {
  const testPaths = collectFilePaths('.')
  const sciptTags = testPaths.map(testPath => (
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
          <script type='module' src='src/index.js'></script>
          ${testFiles}
          <script type='module' src="src/runner.js"></script>
        </body>
      </html>
    `
  )
}

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    return res.writeHead(200, {'Content-type': 'text/html'}).end(buildHtml)
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

  return (
    fileExists
      ? (
        res
          .writeHead(200, {'Content-type': mimeMap[ext] || 'text/plain'})
          .end(fs.readFileSync(pathname))
      ) : (
        res.writeHead(404).end(`File ${pathname} not found!`)
      )
  )
})

server.listen(port, hostname, () => {
  console.log(`Server running on port: ${port}`)
})
