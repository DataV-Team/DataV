import Axios from 'axios'

const timeout = 3000

Axios.defaults.timeout = timeout

function interception (fn, methods) {
  return (...args) => {
    // Request params num
    const argsLen = args.length

    // GET Request
    if (methods === 'get' && argsLen > 1) {
      const requerParams = Object.entries(args[1]).map(([key, value]) => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      }).join('&')

      args[0] += `?${requerParams}`

      args.pop()

      // POST Request
    } else if (methods === 'post' && argsLen > 2) {
      args[1] = Object.entries(args[1]).map(([key, value]) => `${key}=${value}`).join('&')

      args.pop()
    }

    return fn.apply(this, args)
  }
}

export default function (Vue) {
  Vue.prototype.$http = Axios

  Vue.prototype.$http.get = interception(Vue.prototype.$http.get, 'get')
  Vue.prototype.$http.post = interception(Vue.prototype.$http.post, 'post')
}
