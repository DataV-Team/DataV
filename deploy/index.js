const { fileForEach } = require('@jiaminghi/fs')
const Client = require('ftp')
const print = require('./plugin/print')
const { emptyDir, put } = require('./plugin/ftp')
const getNodeParams = require('./plugin/nodeParams')

let config = null

try {
  config = require('./config')
} catch (err) {
  void 0
}

const DIST_PATH = './dist/'
const FTP_PATH = './datav/'

const ftp = new Client()

ftp.on('ready', async foo => {
  print.tip('FTP connected!')

  const isEmpty = await emptyDir(ftp, FTP_PATH)

  if (!isEmpty) {
    print.error('Exception in emptyDir!')

    return false
  }

  let status = true

  await fileForEach(DIST_PATH, async src => {
    const destPath = FTP_PATH + src.split('/').slice(-1)[0]

    print.tip('Upload: ' + destPath)

    if (!await put(ftp, src, destPath)) {
      status = false
      
      print.error('Exception in upload ' + destPath)
    }
  })

  if (status) {
    print.yellow('-------------------------------------')
    print.success('    Automatic Deployment Success!    ')
    print.yellow('-------------------------------------')  
  }

  ftp.destroy()
})

ftp.on('greeting', foo => {
  print.tip('FTP greeting')
})
ftp.on('close', foo => {
  print.tip('FTP close')
})
ftp.on('end', foo => {
  print.tip('FTP end')
})
ftp.on('error', foo => {
  print.tip('FTP error')
})

const { host, user, pass } = config || getNodeParams()

if (!host || !user || !pass) {
  print.error('Upload Dist to FTP Missing Parameters!')

  return false
}

print.tip('Start Upload!')

ftp.connect({
  host,
  user,
  password: pass
})
