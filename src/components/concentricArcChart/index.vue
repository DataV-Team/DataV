<template>
  <div class="concentric-arc-chart">
    <loading v-if="!data" />

    <canvas :ref="ref" />
  </div>
</template>

<script>
export default {
  name: 'ConcentricArcChart',
  props: ['data'],
  data () {
    return {
      ref: `concentric-arc-chart-${(new Date()).getTime()}`,
      canvasDom: '',
      canvasWH: [0, 0],
      ctx: '',

      arcOriginPos: [],

      defaultArcRadiusArea: [0.2, 0.8],
      defaultArcGap: 3,

      arcRadius: [],
      arcRadian: [],
      arcLineWidth: 0,
      arcColor: ''
    }
  },
  watch: {
    data (d) {
      const { draw } = this

      d && draw()
    }
  },
  methods: {
    init () {
      const { $nextTick, initCanvas, calcArcConfig, data, draw } = this

      $nextTick(e => {
        initCanvas()

        calcArcConfig()

        data && draw()
      })
    },
    initCanvas () {
      const { $refs, ref, labelRef, canvasWH } = this

      const canvas = this.canvasDom = $refs[ref]

      this.labelDom = $refs[labelRef]

      canvasWH[0] = canvas.clientWidth
      canvasWH[1] = canvas.clientHeight

      canvas.setAttribute('width', canvasWH[0])
      canvas.setAttribute('height', canvasWH[1])

      this.ctx = canvas.getContext('2d')
    },
    calcArcConfig () {
      const { canvasWH, arcOriginPos } = this

      arcOriginPos[0] = canvasWH[0] / 2
      arcOriginPos[1] = canvasWH[1] / 2
    },
    draw () {
      const { ctx, canvasWH, calcArcRadius, calcArcRadian, calcArcColor, drawArc, drawTitle } = this

      ctx.clearRect(0, 0, ...canvasWH)

      calcArcRadius()

      calcArcRadian()

      calcArcColor()

      drawArc()

      drawTitle()
    },
    calcArcRadius () {
      const { data: { data, arcArea, arcGap }, arcOriginPos, defaultArcRadiusArea, defaultArcGap } = this

      const arcNum = data.length

      const fullRadius = (arcOriginPos[0] > arcOriginPos[1] ? arcOriginPos[1] : arcOriginPos[0])

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
      const { data: { data } } = this

      const fullRadian = Math.PI / 2 * 3

      const offsetRadian = Math.PI * 0.5

      this.arcRadian = new Array(data.length).fill(0).map((t, i) => data[i].value * fullRadian - offsetRadian)
    },
    calcArcColor () {
      const { ctx, data: { color }, arcRadius: [ radius ], arcLineWidth, arcOriginPos: [x, y] } = this

      const linearGradientColor = ctx.createLinearGradient(x, y - radius - arcLineWidth, x, y + radius + arcLineWidth)

      const colorGap = 1 / (color.length - 1)

      color.forEach((c, i) => linearGradientColor.addColorStop(colorGap * i, c))

      this.arcColor = linearGradientColor

      this.ctx.strokeStyle = linearGradientColor
    },
    drawArc () {
      const { ctx, arcRadius, arcRadian, arcOriginPos, arcLineWidth, arcColor } = this

      const offsetRadian = Math.PI / -2

      ctx.lineWidth = arcLineWidth
      ctx.strokeStyle = arcColor

      arcRadius.forEach((radius, i) => {
        ctx.beginPath()

        ctx.arc(...arcOriginPos, radius, offsetRadian, arcRadian[i])

        ctx.stroke()
      })
    },
    drawTitle () {
      const { ctx, data: { data, fontSize }, arcRadius, arcOriginPos: [ x, y ], arcLineWidth } = this

      const textEndX = x - 10

      ctx.font = `${fontSize || arcLineWidth}px Arial`
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#fff'

      ctx.beginPath()

      data.forEach(({ title }, i) => {
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

  canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
