const { collectFilePaths } = require('./fs_utils.js')

function buildHtml(currentPath, modulePath, shouldIgnore) {
  const testPaths = collectFilePaths(currentPath, shouldIgnore)
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
          <script type='module' src='${modulePath}/src/index.js'></script>
          ${testFiles}
          <script type='module' src='${modulePath}/src/runner.js'></script>
        </body>
      </html>
    `
  )
}

module.exports = {
  buildHtml
}
