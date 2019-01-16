<template>
  <div class="concentric-arc-chart">
    <loading v-if="!status" />

    <div class="canvas-container">
      <canvas :ref="ref" />
    </div>
  </div>
</template>

<script>
import colorsMixin from '../../mixins/colorsMixin.js'
import canvasMixin from '../../mixins/canvasMixin.js'

export default {
  name: 'ConcentricArcChart',
  props: ['data', 'colors'],
  mixins: [colorsMixin, canvasMixin],
  data () {
    return {
      ref: `concentric-arc-chart-${(new Date()).getTime()}`,

      status: false,

      arcOriginPos: [],

      defaultArcRadiusArea: [0.2, 0.8],
      defaultArcGap: 3,
      defaultArcColor: ['#00c0ff', '#3de7c9'],

      arcRadius: [],
      arcRadian: [],
      arcLineWidth: 0,
      arcColor: ''
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
      const { initCanvas, initColors, checkData, draw } = this

      await initCanvas()

      initColors()

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
      const { clearCanvas, calcArcRadius, calcArcRadian, calcArcColor, drawArc, drawTitle } = this

      clearCanvas()

      calcArcRadius()

      calcArcRadian()

      calcArcColor()

      drawArc()

      drawTitle()
    },
    calcArcRadius () {
      const { data: { series, arcArea, arcGap }, centerPos, defaultArcRadiusArea, defaultArcGap } = this

      const arcNum = series.length

      const fullRadius = (centerPos[0] > centerPos[1] ? centerPos[1] : centerPos[0])

      const currentArcArea = arcArea || defaultArcRadiusArea

      const maxRadius = fullRadius * Math.max(...currentArcArea)
      const minRadius = fullRadius * Math.min(...currentArcArea)

      const currentArcGap = arcGap || defaultArcGap

      const arcLineWidth = this.arcLineWidth = (maxRadius - minRadius - currentArcGap * (arcNum - 1)) / arcNum

      const fullArcLineWidth = arcLineWidth + currentArcGap
      const halfArcLineWidth = arcLineWidth / 2

      this.arcRadius = new Array(arcNum).fill(0).map((t, i) => maxRadius - halfArcLineWidth - fullArcLineWidth * i)
    },
    calcArcRadian () {
      const { data: { series } } = this

      const fullRadian = Math.PI / 2 * 3

      const offsetRadian = Math.PI * 0.5

      this.arcRadian = new Array(series.length).fill(0).map((t, i) => series[i].value * fullRadian - offsetRadian)
    },
    calcArcColor () {
      const { ctx, arcLineWidth, defaultArcColor, canvas: { getLinearGradientColor } } = this

      const { drawColors, arcRadius: [ radius ], centerPos: [x, y] } = this

      const colors = drawColors || defaultArcColor

      this.arcColor = getLinearGradientColor(ctx,
        [x, y - radius - arcLineWidth],
        [x, y + radius + arcLineWidth], colors)
    },
    drawArc () {
      const { ctx, arcRadius, arcRadian, centerPos, arcLineWidth, arcColor } = this

      const offsetRadian = Math.PI / -2

      ctx.lineWidth = arcLineWidth
      ctx.strokeStyle = arcColor

      arcRadius.forEach((radius, i) => {
        ctx.beginPath()

        ctx.arc(...centerPos, radius, offsetRadian, arcRadian[i])

        ctx.stroke()
      })
    },
    drawTitle () {
      const { ctx, data: { series, fontSize }, arcRadius, centerPos: [ x, y ], arcLineWidth } = this

      const textEndX = x - 10

      ctx.font = `${fontSize || arcLineWidth}px Arial`
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#fff'

      ctx.beginPath()

      series.forEach(({ title }, i) => {
        ctx.fillText(title, textEndX, y - arcRadius[i])
      })
    }
  },
  mounted () {
    const { init } = this

    init()
  }
}
</script>

<style lang="less">
.concentric-arc-chart {
  position: relative;
  display: flex;
  flex-direction: column;
  color: #fff;

  .canvas-container {
    position: relative;
    flex: 1;
  }

  canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
