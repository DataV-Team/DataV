<template>
  <div class="arc-ring-chart">
    <loading v-if="!data" />

    <div class="label-line" v-else>
      <div class="label-item" v-for="(label, i) in data.data" :key="label.title">
        <div :style="`background-color: ${data.color[i % data.color.length]};`"></div>
        <div>{{ label.title }}</div>
      </div>
    </div>

    <canvas :ref="ref" />
  </div>
</template>

<script>
export default {
  name: 'ArcRingChart',
  props: ['data'],
  data () {
    return {
      ref: `concentric-arc-chart-${(new Date()).getTime()}`,
      canvasDom: '',
      canvasWH: [0, 0],
      ctx: '',

      arcOriginPos: [],

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

      labelLinePoints: []
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
      const { ctx, canvasWH, drawDecorationCircle } = this

      ctx.clearRect(0, 0, ...canvasWH)

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
    drawDecorationCircle () {
      const { ctx, data: { decorationCircleRadius }, defaultDecorationCircleRadius, arcOriginPos } = this

      const radius = this.decorationRadius = Math.min(...arcOriginPos) * (decorationCircleRadius || defaultDecorationCircleRadius)

      ctx.beginPath()

      ctx.strokeStyle = 'rgba(250, 250, 250, 0.2)'

      ctx.lineWidth = 4

      ctx.arc(...arcOriginPos, radius, 0, Math.PI * 2)

      ctx.stroke()

      ctx.beginPath()

      ctx.lineWidth = 1

      ctx.arc(...arcOriginPos, radius - 7, 0, Math.PI * 2)

      ctx.closePath()

      ctx.stroke()
    },
    calcArcRadius () {
      const { data: { data, arcRadiusArea }, defaultArcRadiusArea, arcOriginPos, randomExtend } = this

      const fullRadius = Math.min(...arcOriginPos)

      const currentArcRaidusArea = arcRadiusArea || defaultArcRadiusArea

      const maxRadius = fullRadius * Math.max(...currentArcRaidusArea)
      const minRadius = fullRadius * Math.min(...currentArcRaidusArea)

      this.arcRadius = data.map(t => randomExtend(minRadius, maxRadius))
    },
    calcArcRadian () {
      const { data: { data }, multipleSum, radianOffset } = this

      const valueSum = this.totalValue = multipleSum(...data.map(({ value }) => value))

      let radian = radianOffset

      const fullRadian = Math.PI * 2

      const avgRadian = fullRadian / data.length

      this.arcRadian = data.map(({ value }) => {
        const valueRadian = valueSum === 0 ? avgRadian : value / valueSum * fullRadian

        return [radian, (radian += valueRadian)]
      })
    },
    calcArcWidth () {
      const { data: { data, arcWidthArea }, defaultArcWidthArea, randomExtend } = this

      const currentArea = arcWidthArea || defaultArcWidthArea

      const maxWidth = Math.max(...currentArea)
      const minWidth = Math.min(...currentArea)

      this.arcWidth = data.map(t => randomExtend(minWidth, maxWidth))
    },
    drawArc () {
      const { ctx, arcRadius, arcRadian, arcWidth, data: { color }, arcOriginPos } = this

      const colorNum = color.length

      arcRadius.forEach((radius, i) => {
        ctx.beginPath()

        ctx.arc(...arcOriginPos, radius, ...arcRadian[i])

        ctx.strokeStyle = color[i % colorNum]

        ctx.lineWidth = arcWidth[i]

        ctx.stroke()
      })
    },
    calcLableLinePoints () {
      const { arcRadian, arcRadius, arcOriginPos: [x, y], totalValue } = this

      const { canvas: { getCircleRadianPoint }, data: { data } } = this

      let [leftlabelLineNum, rightLabelLineNum] = [0, 0]

      const arcMiddlePoints = arcRadian.map((radian, i) => {
        const middleRadian = (radian[1] - radian[0]) / 2 + radian[0]

        const point = getCircleRadianPoint(x, y, arcRadius[i], middleRadian)

        point[0] > x && (data[i].value || !totalValue) && rightLabelLineNum++
        point[0] <= x && (data[i].value || !totalValue) && leftlabelLineNum++

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
        if (!data[i].value && totalValue) return [false, false, false, false]

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
      const { ctx, labelLinePoints, canvas: { drawPolyline }, data: { color } } = this

      const colorNum = color.length

      labelLinePoints.forEach((polyline, i) =>
        polyline[0] && drawPolyline(ctx, polyline, 2, color[i % colorNum], false, [10, 0], true))
    },
    drawLabelText () {
      const { ctx, labelLinePoints, data: { data, labelFontSize, fixed }, totalValue, defaultLabelFontSize, arcOriginPos: [x] } = this

      ctx.font = `${labelFontSize || defaultLabelFontSize}px Arial`

      ctx.fillStyle = '#fff'

      let totalPercent = 0

      const dataLast = data.length - 1

      data.forEach(({ value, title }, i) => {
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

  canvas {
    width: 100%;
    height: 100%;
  }

  .label-line {
    position: absolute;
    left: 0px;
    bottom: 0px;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    font-size: 10px;

    .label-item {
      display: flex;
      flex-direction: row;
      margin: 0px 3px;
      height: 20px;
      align-items: center;

      :nth-child(1) {
        width: 10px;
        height: 10px;
        margin-right: 5px;
      }
    }
  }
}
</style>
