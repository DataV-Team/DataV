<template>
  <div id="datav-entrance">
    <div class="datav-container" ref="data-root">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DatavEntrance',
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

      const datavRoot = this.datavRoot = this.$refs['data-root']

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
#datav-entrance {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-size: 100%;
  background-image: url('../../assets/img/bg.png');

  .datav-container {
    transform-origin: left top;
  }
}
</style>
