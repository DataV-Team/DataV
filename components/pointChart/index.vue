<template>
  <div class="point-chart">
    <loading v-if="!data" />

    <div class="canvas-container">
      <canvas :ref="ref" />
    </div>

    <label-line :label="labelLine" :colors="drawColors" />

    <for-slot><slot></slot></for-slot>
  </div>
</template>

<script>
import canvasMixin from '../../mixins/canvasMixin.js'

import colorsMixin from '../../mixins/colorsMixin.js'

import axisMixin from '../../mixins/axisMixin.js'

export default {
  name: 'PointChart',
  mixins: [canvasMixin, colorsMixin, axisMixin],
  props: ['data', 'labelLine', 'colors'],
  data () {
    return {
      ref: `point-chart-${(new Date()).getTime()}`,

      // axis base config
      boundaryGap: true,
      horizon: false,
      mulValueAdd: false,

      defaultPointRadius: 2,

      valuePointPos: []
    }
  },
  watch: {
    data () {
      const { checkData, draw } = this

      checkData() && draw()
    }
  },
  methods: {
    async init () {
      const { initCanvas, initColors } = this

      await initCanvas()

      initColors()

      const { checkData, draw } = this

      checkData() && draw()
    },
    checkData () {
      const { data } = this

      this.status = false

      if (!data || !data.series) return false

      this.status = true

      return true
    },
    draw () {
      const { clearCanvas } = this

      clearCanvas()

      const { initAxis, drawAxis, calcValuePointPos } = this

      initAxis()

      drawAxis()

      calcValuePointPos()

      const { drawPoints } = this

      drawPoints()
    },
    calcValuePointPos () {
      const { data: { series }, valueAxisMaxMin, getAxisPointsPos } = this

      const { axisOriginPos, axisWH, labelAxisTagPos } = this

      this.valuePointPos = series.map(({ value }, i) =>
        getAxisPointsPos(
          valueAxisMaxMin,
          value,
          axisOriginPos,
          axisWH,
          labelAxisTagPos,
          false
        ))
    },
    drawPoints () {
      const { data: { series }, drawSeriesPoint, ctx } = this

      ctx.setLineDash([10, 0])

      series.forEach((seriesItem, i) => drawSeriesPoint(seriesItem, i))
    },
    drawSeriesPoint ({ color: cr, edgeColor, fillColor, radius, opacity }, i) {
      const { drawColors, defaultPointRadius, valuePointPos, drawPoint } = this

      const { color: { hexToRgb }, data: { radius: outerRadius } } = this

      const drawColorsNum = drawColors.length

      const baseColor = drawColors[i % drawColorsNum]

      const trueEdgeColor = edgeColor || cr || baseColor

      let trueFillColor = fillColor || cr || baseColor

      opacity && (trueFillColor = hexToRgb(trueFillColor, opacity))

      const trueRadius = radius || outerRadius || defaultPointRadius

      valuePointPos[i].forEach(cp => {
        if (!cp && cp !== 0) return

        const isSeries = cp[0] instanceof Array

        isSeries && cp.forEach(p => (p || p === 0) && drawPoint(p, trueEdgeColor, trueFillColor, trueRadius))

        !isSeries && drawPoint(cp, trueEdgeColor, trueFillColor, trueRadius)
      })
    },
    drawPoint (pos, edgeColor, fillColor, radius) {
      const { ctx } = this

      ctx.beginPath()

      ctx.arc(...pos, radius, 0, Math.PI * 2)

      ctx.closePath()

      ctx.strokeStyle = edgeColor
      ctx.fillStyle = fillColor

      ctx.fill()
      ctx.stroke()
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
  flex-direction: column;

  .canvas-container {
    flex: 1;

    canvas {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
