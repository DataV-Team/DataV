const fs = require('fs')
const path = require('path')

function readDir (src) {
  return new Promise(resolve => {
    fs.readdir(src, (err, paths) => {
      if (err) {
        console.error(err)

        resolve(false)
      }

      resolve(paths)
    })
  })
}

function stat (src) {
  return new Promise(resolve => {
    fs.stat(src, (err, stats) => {
      if (err) {
        console.error(err)

        resolve(false)
      }

      resolve(stats)
    })
  })
}

function mkdir (src) {
  return new Promise(resolve => {
    fs.mkdir(src, err => {
      if (err) {
        console.error(err)

        resolve(false)
      }

      resolve(true)
    })
  })
}

function access (src, mode = fs.constants.F_OK) {
  return new Promise(resolve => {
    fs.access(src, mode, err => {
      if (err) {
        resolve(false)

        return
      }

      resolve(true)
    })
  })
}

function unlink (src) {
  return new Promise(resolve => {
    fs.unlink(src, err => {
      if (err) {
        console.error(err)

        resolve(false)
      }

      resolve(true)
    })
  })
}

function rmDir (src) {
  return new Promise(resolve => {
    fs.rmdir(src, err => {
      if (err) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

async function clearDir (src) {
  const isExists = await access(src)

  if (!isExists) {
    await mkdir(src)

    return true
  }

  return await emptyDir(src)
}

async function emptyDir (src) {
  const paths = await readDir(src)
  if (!paths) {
    console.error('Exception in emptyDir: paths!')

    return false
  }

  for (let i = 0; i < paths.length; i++) {
    const fullSrc = src + '/' + paths[i]
    const stats = await stat(fullSrc)

    if (!stats) {
      console.error('Exception in emptyDir: stats!')

      return false
    }

    if (stats.isFile()) {
      const isUnlink = await unlink(fullSrc)

      if (!isUnlink) {
        console.error('Exception in emptyDir: isUnlink!')

        return false
      }
    } else if (stats.isDirectory()) {
      const isEmpty = await emptyDir(fullSrc)

      if (!isEmpty) {
        console.error('Exception in emptyDir: isEmpty!')

        return false
      }

      if (!await rmDir(fullSrc)) {
        console.error('Exception in emptyDir: rmDir!')

        return false
      }
    }
  }

  return true
}

async function unlinkDirFileByExtname (src, extnames = []) {
  const paths = await readDir(src)

  if (!paths) {
    console.error('Exception in unlinkDirFileByExtname: paths!')

    return false
  }

  for (let i = 0; i < paths.length; i++) {
    const fullSrc = src + '/' + paths[i]
    const stats = await stat(fullSrc)

    if (!stats) {
      console.error('Exception in unlinkDirFileByExtname: stats!')

      return false
    }

    if (stats.isFile()) {
      const cxtname = path.extname(fullSrc)
      if (extnames.findIndex(name => name === cxtname) === -1) continue

      const isUnlink = await unlink(fullSrc)
      if (!isUnlink) {
        console.error('Exception in unlinkDirFileByExtname: isUnlink!')

        return false
      }
    } else if (stats.isDirectory()) {
      const recursive = await unlinkDirFileByExtname(fullSrc, extnames)

      if (!recursive) {
        console.error('Exception in unlinkDirFileByExtname: recursive!')

        return false
      }
    }
  }

  return true
}

async function copyDir (src, target) {
  if (!src || !target) {
    console.error('copyDir missing parameters!')

    return false
  }

  const isClear = await clearDir(target)

  if (!isClear) {
    console.error('Exception in copyDir: isClear!')

    return false
  }

  const paths = await readDir(src)
  if (!paths) {
    console.error('Exception in copyDir: paths!')

    return false
  }

  for (let i = 0; i < paths.length; i++) {
    const fullSrc = src + '/' + paths[i]
    const fullTarget = target + '/' + paths[i]
    const stats = await stat(fullSrc)

    if (!stats) {
      console.error('Exception in copyDir: stats!')

      return false
    }

    if (stats.isFile()) {
      fs.createReadStream(fullSrc).pipe(fs.createWriteStream(fullTarget))
    } else if (stats.isDirectory()) {
      const isMkdir = await mkdir(fullTarget)

      if (!isMkdir) {
        console.error('Exception in copyDir: isMkdir!')

        return false
      }

      const isCopy = await copyDir(fullSrc, fullTarget)

      if (!isCopy) {
        console.error('Exception in copyDir: isCopy!')

        return false
      }
    }
  }

  return true
}

async function fileForEach (src, callback) {
  if (!src || !callback) {
    console.error('fileForEach missing parameters!')

    return false
  }

  const paths = await readDir(src)
  if (!paths) {
    console.error('Exception in fileForEach: paths!')

    return false
  }

  for (let i = 0; i < paths.length; i++) {
    const fullSrc = src + '/' + paths[i]
    const stats = await stat(fullSrc)

    if (!stats) {
      console.error('Exception in fileForEach: stats!')

      return false
    }

    if (stats.isFile()) {
      await callback(fullSrc)
    } else if (stats.isDirectory()) {
      const recursive = await fileForEach(fullSrc, callback)

      if (!recursive) {
        console.error('Exception in fileForEach: recursive!')

        return false
      }
    }
  }

  return true
}

async function readFile (src, encoding = 'utf8') {
  return new Promise(resolve => {
    fs.readFile(src, encoding, (err, data) => {
      if (err) {
        console.error(err)

        resolve(false)
      } else {
        resolve(data)
      }
    })
  })
}

async function writeFile (src, string, encoding = 'utf8') {
  return new Promise(resolve => {
    fs.writeFile(src, string, encoding, err => {
      if (err) {
        console.error(err)

        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

async function dirForEach (src, callback) {
  if (!src || !callback) {
    console.error('dirForEach missing parameters!')

    return false
  }

  const paths = await readDir(src)
  if (!paths) {
    console.error('Exception in dirForEach: paths!')

    return false
  }

  for (let i = 0; i < paths.length; i++) {
    const fullSrc = src + '/' + paths[i]
    const stats = await stat(fullSrc)

    if (!stats) {
      console.error('Exception in dirForEach: stats!')

      return false
    }

    if (stats.isDirectory()) await callback(fullSrc)
  }

  return true
}

module.exports = {
  readDir,
  stat,
  mkdir,
  clearDir,
  emptyDir,
  unlinkDirFileByExtname,
  copyDir,
  fileForEach,
  readFile,
  writeFile,
  dirForEach
}