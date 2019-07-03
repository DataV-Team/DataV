const { exec } = require('child_process')

function doExec (execString, maxBuffer = 1024 ** 5) {
  return new Promise(resolve => {
    exec(execString, {
      maxBuffer
    }, err => {
      if (err) {
        console.error(err)

        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

module.exports = doExec