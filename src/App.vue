<template>
  <div id="app" ref="app">
    <current-data-v />
  </div>
</template>

<script>
// import currentDataV from './views/electronicFile/index'
import currentDataV from './views/manageDesk/index'

export default {
  name: 'app',
  components: {
    currentDataV
  },
  data () {
    return {
      scale: 0,
      app: ''
    }
  },
  methods: {
    init () {
      const { initConfig, setAppScale, bindReSizeEventHandler } = this

      initConfig()

      setAppScale()

      bindReSizeEventHandler()
    },
    initConfig () {
      const { width, height } = screen

      this.allWidth = width

      const app = this.app = this.$refs['app']

      app.style.width = `${width}px`
      app.style.height = `${height}px`
    },
    setAppScale () {
      const { allWidth, app } = this

      const currentWidth = document.body.clientWidth

      app.style.transform = `scale(${currentWidth / allWidth})`
    },
    bindReSizeEventHandler () {
      const { debounce, setAppScale } = this

      if (!debounce) return

      window.addEventListener('resize', debounce(100, setAppScale))
    }
  },
  mounted () {
    const { init } = this

    init()
  }
}
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  transform-origin: left top;
  overflow: hidden;
  user-select: none;
}
</style>
