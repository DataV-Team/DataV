<template>
  <div id="dv-full-screen-container" ref="full-screen-container">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'FullScreenContainer',
  data () {
    return {
      scale: 0,
      datavRoot: ''
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

      const datavRoot = this.datavRoot = this.$refs['full-screen-container']

      datavRoot.style.width = `${width}px`
      datavRoot.style.height = `${height}px`
    },
    setAppScale () {
      const { allWidth, datavRoot } = this

      const currentWidth = document.body.clientWidth

      datavRoot.style.transform = `scale(${currentWidth / allWidth})`
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
#dv-full-screen-container {
  position: fixed;
  top: 0px;
  left: 0px;
  overflow: hidden;
  transform-origin: left top;
  z-index: 999;
}
</style>
