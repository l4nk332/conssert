const fs = require('fs')
const path = require('path')

function collectFilePaths(dirPath, shouldIgnore = () => false) {
  return (
    fs.readdirSync(dirPath)
      .reduce((collected, child) => {
        const childPath = path.join(dirPath, child)

        const isDirectory = fs.lstatSync(childPath).isDirectory()
        const isTestFile = child.endsWith('.test.js')
        const isNodeModules = child.includes('node_modules')
        const isIgnoredPath = shouldIgnore(childPath)

        if (!(isDirectory || isTestFile) || isNodeModules || isIgnoredPath) {
          return collected
        }

        return collected.concat(
          isDirectory
            ? collectFilePaths(childPath, shouldIgnore)
            : [childPath]
        )
      }, [])
  )
}

module.exports = {
  collectFilePaths
}
