const fs = require('fs')
const path = require('path')

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

module.exports = {
  collectFilePaths
}
