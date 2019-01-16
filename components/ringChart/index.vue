<template>
  <div class="ring-chart">
    <loading v-if="!status" />

    <div class="canvas-container">
      <canvas :ref="ref" />

      <div class="center-info" v-if="data.active">
        <div class="percent-show">{{percent}}</div>
        <div class="current-label" :ref="labelRef">{{data.series[activeIndex].title}}</div>
      </div>
    </div>

    <label-line :label="dealAfterLabelLine" :colors="drawColors" />
  </div>
</template>

<script>
import colorsMixin from '../../mixins/colorsMixin.js'
import canvasMixin from '../../mixins/canvasMixin.js'

export default {
  name: 'RingChart',
  props: ['data', 'labelLine', 'colors'],
  mixins: [colorsMixin, canvasMixin],
  data () {
    return {
      ref: `ring-chart-${(new Date()).getTime()}`,

      status: false,

      labelRef: `label-ref-${(new Date()).getTime()}`,
      labelDom: '',

      ringRadius: '',
      ringLineWidth: '',
      maxRingWidthP: 1.15,

      activeIndex: 1,
      activePercent: 1,
      activeAddStatus: true,

      arcData: [],
      radiusData: [],
      aroundLineData: [],
      aroundTextData: [],
      aroundTextFont: '13px Arial',

      activeIncrease: 0.005,
      activeTime: 4500,

      offsetAngle: Math.PI * 0.5 * -1,

      dealAfterLabelLine: [],

      percent: 0,
      totalValue: 0,

      activeAnimationHandler: '',
      awaitActiveHandler: ''
    }
  },
  watch: {
    data (d) {
      const { checkData, reDraw } = this

      checkData() && reDraw()
    },
    activeIndex () {
      const { doPercentAnimation, doLabelTextAnimation } = this

      doPercentAnimation()

      doLabelTextAnimation()
    }
  },
  methods: {
    async init () {
      const { initCanvas, initColors, calcRingConfig, checkData, draw } = this

      await initCanvas()

      initColors()

      calcRingConfig()

      checkData() && draw()
    },
    calcRingConfig () {
      const { canvasWH } = this

      const ringRadius = this.ringRadius = Math.min(...canvasWH) * 0.6 / 2

      this.ringLineWidth = ringRadius * 0.3
    },
    checkData () {
      const { data } = this

      this.status = false

      if (!data || !data.series) return false

      this.status = true

      return true
    },
    draw () {
      const { clearCanvas, calcLabelLineData } = this

      clearCanvas()

      calcLabelLineData()

      const { caclArcData, data: { active }, drawActive, drwaStatic } = this

      caclArcData()

      active ? drawActive() : drwaStatic()
    },
    calcLabelLineData () {
      const { labelLine, deepClone, data: { series } } = this

      if (!labelLine) return

      const dealAfterLabelLine = this.dealAfterLabelLine = deepClone(labelLine)

      if (labelLine.labels === 'inherit') dealAfterLabelLine.labels = series.map(({ title }) => title)
    },
    caclArcData () {
      const { data: { series } } = this

      const { getTotalValue, offsetAngle } = this

      const totalValue = getTotalValue()

      const full = 2 * Math.PI

      const aveAngle = full / series.length

      let currentPercent = offsetAngle

      this.arcData = []

      series.forEach(({ value }) => {
        const valueAngle = totalValue === 0 ? aveAngle : value / totalValue * full

        this.arcData.push([
          currentPercent,
          currentPercent += valueAngle
        ])
      })
    },
    getTotalValue () {
      const { data: { series } } = this

      let totalValue = 0

      series.forEach(({ value }) => (totalValue += value))

      this.totalValue = totalValue

      return totalValue
    },
    drawActive () {
      const { ctx, canvasWH } = this

      ctx.clearRect(0, 0, ...canvasWH)

      const { calcRadiusData, drawRing, drawActive } = this

      calcRadiusData()

      drawRing()

      this.activeAnimationHandler = requestAnimationFrame(drawActive)
    },
    calcRadiusData () {
      const { arcData, activeAddStatus, activePercent, activeIncrease, activeIndex } = this

      const radiusData = new Array(arcData.length).fill(1)

      const activeRadius = (activeAddStatus ? this.activePercent += activeIncrease : activePercent)

      radiusData[activeIndex] = activeRadius

      const { maxRingWidthP, ringRadius, awaitActive } = this

      const prevRadius = maxRingWidthP - activeRadius + 1

      const prevIndex = activeIndex - 1

      radiusData[prevIndex < 0 ? arcData.length - 1 : prevIndex] = prevRadius

      this.radiusData = radiusData.map(v => (v * ringRadius))

      if (activeRadius >= maxRingWidthP && activeAddStatus) awaitActive()
    },
    awaitActive () {
      const { activeTime, turnToNextActive } = this

      this.activeAddStatus = false

      this.awaitActiveHandler = setTimeout(turnToNextActive, activeTime)
    },
    turnToNextActive () {
      const { arcData, activeIndex } = this

      this.activePercent = 1

      this.activeIndex = (activeIndex + 1 === arcData.length ? 0 : activeIndex + 1)

      this.activeAddStatus = true
    },
    drawRing () {
      const { arcData, ctx, centerPos, radiusData } = this

      const { ringLineWidth, drawColors } = this

      const arcNum = arcData.length

      arcData.forEach((arc, i) => {
        ctx.beginPath()

        ctx.arc(...centerPos, radiusData[i], ...arc)

        ctx.lineWidth = ringLineWidth

        ctx.strokeStyle = drawColors[i % arcNum]

        ctx.stroke()
      })
    },
    doPercentAnimation () {
      const { totalValue, percent, activeIndex, data: { series }, doPercentAnimation } = this

      if (!totalValue) return

      const currentValue = series[activeIndex].value

      let currentPercent = Math.trunc(currentValue / totalValue * 100)

      currentPercent === 0 && (currentPercent = 1)
      currentValue === 0 && (currentPercent = 0)

      if (currentPercent === percent) return

      currentPercent > percent ? this.percent++ : this.percent--

      setTimeout(doPercentAnimation, 10)
    },
    doLabelTextAnimation () {
      let { labelDom, $refs, labelRef } = this

      if (!labelDom) labelDom = this.labelDom = $refs[labelRef]

      labelDom.setAttribute('class', 'current-label transform-text')

      setTimeout(() => {
        labelDom.setAttribute('class', 'current-label')
      }, 2000)
    },
    drwaStatic () {
      const { drawStaticRing, calcAroundLineData, drawAroundLine, calcAroundTextData, drawAroundText } = this

      drawStaticRing()

      calcAroundLineData()

      drawAroundLine()

      calcAroundTextData()

      drawAroundText()
    },
    drawStaticRing () {
      const { arcData, ringRadius, drawRing } = this

      this.radiusData = new Array(arcData.length).fill(1).map(v => v * ringRadius)

      drawRing()
    },
    calcAroundLineData () {
      const { arcData, ringRadius, ringLineWidth, centerPos: [x, y], data: { series }, canvas, totalValue } = this

      const { getCircleRadianPoint } = canvas

      const radian = arcData.map(([a, b]) => (a + (b - a) / 2))

      const radius = ringRadius + ringLineWidth / 2

      const aroundLineData = radian.map(r => getCircleRadianPoint(x, y, radius, r))

      const lineLength = 35

      this.aroundLineData = aroundLineData.map(([bx, by], i) => {
        if (!series[i].value && totalValue) return [false, false]

        const lineEndXPos = (bx > x ? bx + lineLength : bx - lineLength)

        return [
          [bx, by],
          [lineEndXPos, by]
        ]
      })
    },
    drawAroundLine () {
      const { aroundLineData, drawColors, ctx, canvas: { drawLine } } = this

      const colorNum = drawColors.length

      aroundLineData.forEach(([lineBegin, lineEnd], i) =>
        lineBegin !== false &&
        drawLine(ctx, lineBegin, lineEnd, 1, drawColors[i % colorNum]))
    },
    calcAroundTextData () {
      const { data: { series, fixed }, totalValue } = this

      const aroundTextData = this.aroundTextData = []

      if (!totalValue) return data.forEach(({ v, title }, i) => aroundTextData.push([0, title]))

      const dataLast = series.length - 1

      let totalPercent = 0

      series.forEach(({ value, title }, i) => {
        if (!value) return aroundTextData.push([false, false])

        let percent = Number((value / totalValue * 100).toFixed(fixed || 1))

        percent < 0.1 && (percent = 0.1)

        const currentPercent = (i === dataLast ? 100 - totalPercent : percent).toFixed(fixed || 1)

        aroundTextData.push([currentPercent, title])

        totalPercent += percent
      })
    },
    drawAroundText () {
      const { ctx, aroundTextData, aroundTextFont, aroundLineData, centerPos: [x] } = this

      ctx.font = aroundTextFont
      ctx.fillStyle = '#fff'

      aroundTextData.forEach(([percent, title], i) => {
        if (percent === false) return

        const currentPos = aroundLineData[i][1]

        ctx.textAlign = 'start'

        currentPos[0] < x && (ctx.textAlign = 'end')

        ctx.textBaseline = 'bottom'
        ctx.fillText(`${percent}%`, ...currentPos)

        ctx.textBaseline = 'top'
        ctx.fillText(title, ...currentPos)
      })
    },
    reDraw () {
      const { activeAnimationHandler, draw } = this

      cancelAnimationFrame(activeAnimationHandler)

      draw()
    }
  },
  mounted () {
    const { init } = this

    init()
  }
}
</script>

<style lang="less">
.ring-chart {
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

  .center-info {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    font-family: "Microsoft Yahei", Arial, sans-serif;
    max-width: 25%;

    .percent-show {
      font-size: 28px;

      &::after {
        content: '%';
        font-size: 15px;
        margin-left: 5px;
      }
    }

    .current-label {
      font-size: 16px;
      margin-top: 5%;
      transform: rotateY(0deg);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .transform-text {
      animation: transform-text 2s linear;
    }

    @keyframes transform-text {
      to {
        transform: rotateY(360deg);
      }
    }
  }
}
</style>
