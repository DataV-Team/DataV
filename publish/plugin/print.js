const print = {
  log (info) {
    console.log(info)
  },
  warn (info) {
    console.log('\033[31;33m' + info + '\033[0m')
  },
  error (info) {
    console.log('\033[31;40m' + info + '\033[0m')
  },
  tip (info) {
    console.log('\033[40;32m' + info + '\033[0m')
  },
  success (info) {
    console.log('\033[42;30m' + info + '\033[0m')
  },
  yellow (info) {
    console.log('\033[31;33m' + info + '\033[0m')
  }
}

module.exports = print
