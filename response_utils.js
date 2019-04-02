const { collectFilePaths } = require('./fs_utils.js')

function buildHtml(currentPath, modulePath, shouldIgnore) {
  const testPaths = collectFilePaths(currentPath, shouldIgnore)
  const testFiles = testPaths.map(testPath => (
    `<script type='module' src='${testPath}'></script>`
  )).join('')

  const FAVICON_PATH = `${modulePath}/src/assets/favicon`

  return (
    `
      <!DOCTYPE html>
      <html lang='en'>
        <head>
          <meta charset='UTF-8'>
          <title>Conssert Browser Testing</title>
          <link rel='apple-touch-icon' sizes='57x57' href='${FAVICON_PATH}/apple-icon-57x57.png'>
          <link rel='apple-touch-icon' sizes='60x60' href='${FAVICON_PATH}/apple-icon-60x60.png'>
          <link rel='apple-touch-icon' sizes='72x72' href='${FAVICON_PATH}/apple-icon-72x72.png'>
          <link rel='apple-touch-icon' sizes='76x76' href='${FAVICON_PATH}/apple-icon-76x76.png'>
          <link rel='apple-touch-icon' sizes='114x114' href='${FAVICON_PATH}/apple-icon-114x114.png'>
          <link rel='apple-touch-icon' sizes='120x120' href='${FAVICON_PATH}/apple-icon-120x120.png'>
          <link rel='apple-touch-icon' sizes='144x144' href='${FAVICON_PATH}/apple-icon-144x144.png'>
          <link rel='apple-touch-icon' sizes='152x152' href='${FAVICON_PATH}/apple-icon-152x152.png'>
          <link rel='apple-touch-icon' sizes='180x180' href='${FAVICON_PATH}/apple-icon-180x180.png'>
          <link rel='icon' type='image/png' sizes='192x192'  href='${FAVICON_PATH}/android-icon-192x192.png'>
          <link rel='icon' type='image/png' sizes='32x32' href='${FAVICON_PATH}/favicon-32x32.png'>
          <link rel='icon' type='image/png' sizes='96x96' href='${FAVICON_PATH}/favicon-96x96.png'>
          <link rel='icon' type='image/png' sizes='16x16' href='${FAVICON_PATH}/favicon-16x16.png'>
          <link rel='manifest' href='${FAVICON_PATH}/manifest.json'>
          <meta name='msapplication-TileColor' content='#ffffff'>
          <meta name='msapplication-TileImage' content='${FAVICON_PATH}/ms-icon-144x144.png'>
          <meta name='theme-color' content='#ffffff'>
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
