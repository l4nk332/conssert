const { collectFilePaths } = require('./fs_utils.js')

function buildHtml(currentPath) {
  const testPaths = collectFilePaths(currentPath)
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

module.exports = {
  buildHtml
}
