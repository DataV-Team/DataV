const { copyDir, fileForEach } = require('./plugin/fs')
const { print } = require('./plugin/print')

const PACKAGE_SRC = './src'
const COMPILE_SRC = './lib'

async function start () {
  const copyPackage = await copyDir(PACKAGE_SRC, COMPILE_SRC)

  if (!copyPackage) {
    print.error('Exception in copyPackage!')

    return false
  }

  fileForEach(COMPILE_SRC, src => {
    print.tip(src)
  })
}

module.exports = {
  start
}


