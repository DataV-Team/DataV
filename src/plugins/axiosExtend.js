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
      .then(res => {
        let { respCode, respMessage, serverDate, respBody, respList } = res.data
        /**
         * respCode:
         * success   成功
         * error     失败
         * warning   警告
         * fatalError 系统错误
         * session_timeout 会话超时或无效
         */
        let temp = {
          code: respCode,
          msg: respMessage,
          timestamp: serverDate,
          data: {}
        }
        // 返回数据为list
        if (respList) {
          let data = {
            list: respList,
            pageIndex: res.data.pageIndex,
            pageSize: res.data.pageSize,
            pageCount: res.data.pages,
            total: res.data.recCount
          }
          temp.data = data
          // 开发对接接口过程中的辅助字段说明
          if (res.data.zhConsult) {
            temp.remarks = res.data.zhConsult
          }
        } else {
          temp.data = { ...respBody }
        }
        return temp
      })
  }
}

export default function (Vue) {
  Vue.prototype.$http = Axios

  Vue.prototype.$http.get = interception(Vue.prototype.$http.get, 'get')
  Vue.prototype.$http.post = interception(Vue.prototype.$http.post, 'post')
}
