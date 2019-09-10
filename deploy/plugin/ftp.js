async function getList (ftp, src) {
  return new Promise(resolve => {
    ftp.list(src, (err, list) => {
      if (err) {
        console.error(err)

        resolve(false)
      } else {
        resolve(list)
      }
    })
  })
}

async function rmDir (ftp, src, recusive = true) {
  return new Promise(resolve => {
    ftp.rmdir(src, recusive, err => {
      if (err) {
        console.error(err)

        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

async function deleteFile (ftp, src) {
  return new Promise(resolve => {
    ftp.delete(src, err => {
      if (err) {
        console.error(err)

        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

async function emptyDir (ftp, src, except = []) {
  const list = await getList(ftp, src)

  for (let i = 0, listNum = list.length; i < listNum; i++) {
    const { type, name } = list[i]

    if (type === 'd' && (name === '.' || name === '..')) continue
    if (except.find(n => n === name)) continue

    const fullSrc = `${src}${name}`

    if (type === 'd') {
      if (!await rmDir(ftp, fullSrc, true)) return false
    } else {
      if (!await deleteFile(ftp, fullSrc)) return false
    }
  }

  return true
}

async function put (ftp, src, dest) {
  return new Promise(resolve => {
    ftp.put(src, dest, err => {
      if (err) {
        console.error(err)

        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

async function mkDir (ftp, src, recusive = true) {
  return new Promise(resolve => {
    ftp.mkdir(src, recusive, err => {
      if (err) {
        console.error(err)

        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

module.exports = {
  put,
  rmDir,
  mkDir,
  getList,
  emptyDir,
  deleteFile
}