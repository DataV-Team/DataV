<template>
  <div class="column-chart">
    <loading v-if="!data" />

    <div class="canvas-container">
      <canvas :ref="ref" />
    </div>

    <label-line :label="data.labelLine" :colors="drawColors" />
  </div>
</template>

<script>
import colorsMixin from '../../mixins/colorsMixin.js'

import canvasMixin from '../../mixins/canvasMixin.js'

import axisMixin from '../../mixins/axisMixin.js'

export default {
  name: 'ColumnChart',
  mixins: [colorsMixin, canvasMixin, axisMixin],
  data () {
    return {
      ref: `radar-chart-${(new Date()).getTime()}`,

      axisType: 'column'
    }
  },
  props: ['data', 'colors'],
  methods: {
    async init () {
      const { initCanvas, data, draw } = this

      await initCanvas()

      data && draw()
    },
    draw () {
      const { clearCanvas, initColors, initAxis, drawAxis } = this

      clearCanvas()

      initColors()

      initAxis()

      drawAxis()
    }
  },
  mounted () {
    const { init } = this

    init()
  }
}
</script>

<style lang="less">
.column-chart {
  position: relative;
  display: flex;
  flex-direction: column;

  .canvas-container {
    flex: 1;
  }

  canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
