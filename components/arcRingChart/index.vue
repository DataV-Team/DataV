<template>
  <div class="arc-ring-chart">
    <loading v-if="!status" />

    <div class="canvas-container">
      <canvas :ref="ref" />
    </div>

    <label-line :label="dealAfterLabelLine" :colors="drawColors" />
  </div>
</template>

<script>
import colorsMixin from '../../mixins/colorsMixin.js'
import canvasMixin from '../../mixins/canvasMixin.js'

export default {
  name: 'ArcRingChart',
  props: ['data', 'labelLine', 'colors'],
  mixins: [colorsMixin, canvasMixin],
  data () {
    return {
      ref: `concentric-arc-chart-${(new Date()).getTime()}`,

      status: false,

      defaultDecorationCircleRadius: 0.65,
      defaultArcRadiusArea: [0.3, 0.4],
      defaultArcWidthArea: [2, 10],
      defaultLabelFontSize: 12,

      decorationRadius: '',

      radianOffset: Math.PI / -2,

      totalValue: 0,

      arcRadius: [],
      arcRadian: [],
      arcWidth: [],

      labelLinePoints: [],

      dealAfterLabelLine: []
    }
  },
  watch: {
    data (d) {
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
      const { clearCanvas, calcLabelLineData, drawDecorationCircle } = this

      clearCanvas()

      calcLabelLineData()

      drawDecorationCircle()

      const { calcArcRadius, calcArcRadian, calcArcWidth, drawArc } = this

      calcArcRadius()

      calcArcRadian()

      calcArcWidth()

      drawArc()

      const { calcLableLinePoints, drawLabelLine, drawLabelText } = this

      calcLableLinePoints()

      drawLabelLine()

      drawLabelText()
    },
    calcLabelLineData () {
      const { labelLine, deepClone, data: { series } } = this

      if (!labelLine) return

      const dealAfterLabelLine = this.dealAfterLabelLine = deepClone(labelLine)

      if (labelLine.labels === 'inherit') dealAfterLabelLine.labels = series.map(({ title }) => title)
    },
    drawDecorationCircle () {
      const { ctx, data: { decorationCircleRadius }, defaultDecorationCircleRadius, centerPos } = this

      const radius = this.decorationRadius = Math.min(...centerPos) * (decorationCircleRadius || defaultDecorationCircleRadius)

      ctx.beginPath()

      ctx.strokeStyle = 'rgba(250, 250, 250, 0.2)'

      ctx.lineWidth = 4

      ctx.arc(...centerPos, radius, 0, Math.PI * 2)

      ctx.stroke()

      ctx.beginPath()

      ctx.lineWidth = 1

      ctx.arc(...centerPos, radius - 7, 0, Math.PI * 2)

      ctx.closePath()

      ctx.stroke()
    },
    calcArcRadius () {
      const { data: { series, arcRadiusArea }, defaultArcRadiusArea, centerPos, randomExtend } = this

      const fullRadius = Math.min(...centerPos)

      const currentArcRaidusArea = arcRadiusArea || defaultArcRadiusArea

      const maxRadius = fullRadius * Math.max(...currentArcRaidusArea)
      const minRadius = fullRadius * Math.min(...currentArcRaidusArea)

      this.arcRadius = series.map(t => randomExtend(minRadius, maxRadius))
    },
    calcArcRadian () {
      const { data: { series }, multipleSum, radianOffset } = this

      const valueSum = this.totalValue = multipleSum(...series.map(({ value }) => value))

      let radian = radianOffset

      const fullRadian = Math.PI * 2

      const avgRadian = fullRadian / series.length

      this.arcRadian = series.map(({ value }) => {
        const valueRadian = valueSum === 0 ? avgRadian : value / valueSum * fullRadian

        return [radian, (radian += valueRadian)]
      })
    },
    calcArcWidth () {
      const { data: { series, arcWidthArea }, defaultArcWidthArea, randomExtend } = this

      const currentArea = arcWidthArea || defaultArcWidthArea

      const maxWidth = Math.max(...currentArea)
      const minWidth = Math.min(...currentArea)

      this.arcWidth = series.map(t => randomExtend(minWidth, maxWidth))
    },
    drawArc () {
      const { ctx, arcRadius, arcRadian, arcWidth, drawColors, centerPos } = this

      const colorNum = drawColors.length

      arcRadius.forEach((radius, i) => {
        ctx.beginPath()

        ctx.arc(...centerPos, radius, ...arcRadian[i])

        ctx.strokeStyle = drawColors[i % colorNum]

        ctx.lineWidth = arcWidth[i]

        ctx.stroke()
      })
    },
    calcLableLinePoints () {
      const { arcRadian, arcRadius, centerPos: [x, y], totalValue } = this

      const { canvas: { getCircleRadianPoint }, data: { series } } = this

      let [leftlabelLineNum, rightLabelLineNum] = [0, 0]

      const arcMiddlePoints = arcRadian.map((radian, i) => {
        const middleRadian = (radian[1] - radian[0]) / 2 + radian[0]

        const point = getCircleRadianPoint(x, y, arcRadius[i], middleRadian)

        point[0] > x && (series[i].value || !totalValue) && rightLabelLineNum++
        point[0] <= x && (series[i].value || !totalValue) && leftlabelLineNum++

        return point
      })

      const { getYPos, decorationRadius } = this

      const labelLineYArea = [y - decorationRadius + 10, y + decorationRadius - 10]

      const leftYPos = getYPos(labelLineYArea, leftlabelLineNum)
      const rightYPos = getYPos(labelLineYArea, rightLabelLineNum)

      const offsetX = decorationRadius + 10

      const leftlabelLineEndX = x - offsetX
      const rightLableLineEndX = x + offsetX

      const maxRadius = Math.max(...arcRadius)

      const leftNearRadiusX = x - maxRadius - 8
      const rightNearRadiusX = x + maxRadius + 8

      this.labelLinePoints = arcMiddlePoints.map(([px, py], i) => {
        if (!series[i].value && totalValue) return [false, false, false, false]

        if (px > x) {
          const yPos = rightYPos.shift()

          return [
            [px, py],
            [rightNearRadiusX, py],
            [rightLableLineEndX - 10, yPos],
            [rightLableLineEndX, yPos]
          ]
        } else {
          const yPos = leftYPos.pop()

          return [
            [px, py],
            [leftNearRadiusX, py],
            [leftlabelLineEndX + 10, yPos],
            [leftlabelLineEndX, yPos]
          ]
        }
      })
    },
    getYPos (area, num) {
      let gap = 0

      const minus = area[1] - area[0]

      if (num === 1) {
        return [area[0] + minus / 2]
      } else if (num === 2) {
        const offset = minus * 0.1

        return [area[0] + offset, area[1] - offset]
      } else {
        gap = minus / (num - 1)

        return new Array(num).fill(0).map((t, i) => area[0] + i * gap)
      }
    },
    drawLabelLine () {
      const { ctx, labelLinePoints, canvas: { drawPolyline }, drawColors } = this

      const colorNum = drawColors.length

      labelLinePoints.forEach((polyline, i) =>
        polyline[0] && drawPolyline(ctx, polyline, 2, drawColors[i % colorNum], false, [10, 0], true))
    },
    drawLabelText () {
      const { ctx, labelLinePoints, data: { series, labelFontSize, fixed }, totalValue, defaultLabelFontSize, centerPos: [x] } = this

      ctx.font = `${labelFontSize || defaultLabelFontSize}px Arial`

      ctx.fillStyle = '#fff'

      let totalPercent = 0

      const dataLast = series.length - 1

      series.forEach(({ value, title }, i) => {
        if (!value && totalValue) return

        let currentPercent = (value / totalValue * 100).toFixed(fixed || 1)

        i === dataLast && (currentPercent = (100 - totalPercent).toFixed(fixed || 1))

        !totalValue && (currentPercent = 0)

        const textPos = labelLinePoints[i][2]

        const isLeft = textPos[0] < x

        ctx.textAlign = isLeft ? 'end' : 'start'

        ctx.textBaseline = 'bottom'

        ctx.fillText(`${currentPercent}%`, ...textPos)

        ctx.textBaseline = 'top'

        ctx.fillText(title, ...textPos)

        totalPercent += Number(currentPercent)
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
.arc-ring-chart {
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
