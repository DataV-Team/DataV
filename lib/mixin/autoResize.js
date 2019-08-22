import { debounce, observerDomResize } from '../util/index'

export default {
  data () {
    return {
      dom: '',

      width: 0,
      height: 0,

      debounceInitWHFun: '',

      domObserver: ''
    }
  },
  methods: {
    async autoResizeMixinInit () {
      const { initWH, getDebounceInitWHFun, bindDomResizeCallback, afterAutoResizeMixinInit } = this

      await initWH(false)

      getDebounceInitWHFun()

      bindDomResizeCallback()

      if (typeof afterAutoResizeMixinInit === 'function') afterAutoResizeMixinInit()
    },
    initWH (resize = true) {
      const { $nextTick, $refs, ref, onResize } = this

      return new Promise(resolve => {
        $nextTick(e => {
          const dom = this.dom = $refs[ref]

          this.width = dom.clientWidth
          this.height = dom.clientHeight

          if (typeof onResize === 'function' && resize) onResize()

          resolve()
        })
      })
    },
    getDebounceInitWHFun () {
      const { initWH } = this

      this.debounceInitWHFun = debounce(100, initWH)
    },
    bindDomResizeCallback () {
      const { dom, debounceInitWHFun } = this

      this.domObserver = observerDomResize(dom, debounceInitWHFun)

      window.addEventListener('resize', debounceInitWHFun)
    },
    unbindDomResizeCallback () {
      let { domObserver, debounceInitWHFun } = this

      domObserver.disconnect()
      domObserver.takeRecords()
      domObserver = null

      window.removeEventListener('resize', debounceInitWHFun)
    }
  },
  mounted () {
    const { autoResizeMixinInit } = this

    autoResizeMixinInit()
  },
  beforeDestroy () {
    const { unbindDomResizeCallback } = this

    unbindDomResizeCallback()
  }
}
