const { copyDir, fileForEach, readFile } = require('./plugin/fs')
const print = require('./plugin/print')
const path = require('path')

const PACKAGE_SRC = './src'
const COMPILE_SRC = './lib'

async function start () {
  const copyPackage = await copyDir(PACKAGE_SRC, COMPILE_SRC)

  if (!copyPackage) {
    print.error('Exception in copyPackage!')

    return false
  }

  const abstract = await abstractLessFromVue()
}

async function abstractLessFromVue () {
  fileForEach(COMPILE_SRC, async src => {
    if (path.extname(src) !== '.vue') return

    const data = await readFile(src).split('<style>')

    const style = data

    console.warn(data)
  })
}

module.exports = {
  start
}


