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
    async init () {
      const { initWH, getDebounceInitWHFun, bindDomResizeCallback } = this

      await initWH()

      getDebounceInitWHFun()

      bindDomResizeCallback()
    },
    initWH () {
      const { $nextTick, $refs, ref } = this

      return new Promise(resolve => {
        $nextTick(e => {
          const dom = this.dom = $refs[ref]

          this.width = dom.clientWidth
          this.height = dom.clientHeight

          resolve()
        })
      })
    },
    getDebounceInitWHFun () {
      const { debounce, initWH } = this

      this.debounceInitWHFun = debounce(100, initWH)
    },
    bindDomResizeCallback () {
      const { dom, debounceInitWHFun, observerDomResize } = this

      this.domObserver = observerDomResize(dom, debounceInitWHFun)

      window.addEventListener('resize', debounceInitWHFun)
    },
    unbindDomResizeCallback () {
      const { domObserver, debounceInitWHFun } = this

      domObserver.disconnect()
      domObserver.takeRecords()
      domObserver = null

      window.removeEventListener('resize', debounceInitWHFun)
    }
  },
  mounted () {
    const { init } = this

    init()
  },
  beforeDestroyed () {
    const { unbindDomResizeCallback } = this

    unbindDomResizeCallback()
  }
}