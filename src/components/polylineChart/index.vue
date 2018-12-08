<template>
  <div class="polyline-chart">
    <canvas :ref="ref" />
  </div>
</template>

<script>
export default {
  name: 'PolylineChart',
  props: ['data'],
  data () {
    return {
      ref: `ring-chart-${(new Date()).getTime()}`,
      canvasDom: '',
      canvasWH: [0, 0],
      ctx: ''
    }
  },
  methods: {
    init () {
      const { $nextTick, initCanvas } = this

      $nextTick(e => {
        initCanvas()
      })
    },
    initCanvas () {
      const { $refs, ref, canvasWH } = this

      const canvas = this.canvasDom = $refs[ref]

      canvasWH[0] = canvas.clientWidth
      canvasWH[1] = canvas.clientHeight

      canvas.setAttribute('width', canvasWH[0])
      canvas.setAttribute('height', canvasWH[1])

      this.ctx = canvas.getContext('2d')
    }
  },
  mounted () {
    const { init } = this

    init()
  }
}
</script>

<style>

</style>
