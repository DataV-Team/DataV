function getNodeParams () {
  const params = {}

  process.argv.slice(2).forEach(param => {
    param = param.split('=')

    params[param[0]] = param[1]
  })

  return params
}

module.exports = getNodeParams