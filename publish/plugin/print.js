const print = {
  log (info) {
    console.log(info)
  },
  warn (info) {
    console.log('\033[31;33m' + info)
  },
  error (info) {
    console.log('\033[31;30m' + info)
  },
  tip (info) {
    console.log('\033[40;32m' + info)
  },
  success (info) {
    console.log('\033[42;30m' + info)
  }
}

module.exports = {
  print
}