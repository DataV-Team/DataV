<template>
  <div class="point-chart">
    <loading v-if="!data" />

    <div class="canvas-container">
      <canvas :ref="ref" />
    </div>
  </div>
</template>

<script>
import canvasMixin from '../../mixins/canvasMixin.js'

import colorsMixin from '../../mixins/colorsMixin.js'

import axisMixinEx from '../../mixins/axisMixinEx.js'

export default {
  name: 'PointChart',
  mixins: [canvasMixin, colorsMixin, axisMixinEx],
  props: ['data', 'colors'],
  data () {
    return {
      ref: `point-chart-${(new Date()).getTime()}`,

      // axis base config
      boundaryGap: true,
      horizon: false,
      mulValueAdd: true
    }
  },
  methods: {
    async init () {
      const { initCanvas, initColors, initAxis } = this

      await initCanvas()

      initColors()

      initAxis()

      const { drawAxis } = this

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
.point-chart {
  position: relative;
  display: flex;

  .canvas-container {
    flex: 1;

    canvas {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
