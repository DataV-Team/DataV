<template>
  <div class="ring-chart">
    <canvas :ref="ref" />

    <loading v-if="!data" />

    <template v-else>
      <div class="center-info" v-if="data.active">
        <div class="percent-show">{{percent}}</div>
        <div class="current-label" :ref="labelRef">{{data.data[activeIndex].title}}</div>
      </div>

      <div class="label-line">
        <div class="label-container">

          <div class="label" v-for="(label, index) in data.data" :key="label.title">
            <div :style="`background-color: ${data.color[index % data.data.length]}`" />
            <div>{{ label.title }}</div>
          </div>

        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'RingChart',
  props: ['data'],
  data () {
    return {
      ref: `ring-chart-${(new Date()).getTime()}`,
      canvasDom: '',
      canvasWH: [0, 0],
      ctx: '',

      labelRef: `label-ref-${(new Date()).getTime()}`,
      labelDom: '',

      ringRadius: '',
      ringOriginPos: [0, 0],
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
      activeTime: 2500,

      offsetAngle: Math.PI * 0.5 * -1,

      percent: 0,
      totalValue: 0,

      activeAnimationHandler: '',
      awaitActiveHandler: ''
    }
  },
  watch: {
    data (d) {
      const { reDraw } = this

      if (!d) return

      reDraw()
    },
    activeIndex () {
      const { doPercentAnimation, doLabelTextAnimation } = this

      doPercentAnimation()

      doLabelTextAnimation()
    }
  },
  methods: {
    init () {
      const { $nextTick, initCanvas, calcRingConfig, data, draw } = this

      $nextTick(e => {
        initCanvas()

        calcRingConfig()

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
    calcRingConfig () {
      const { canvasWH, ringOriginPos } = this

      ringOriginPos[0] = canvasWH[0] / 2
      ringOriginPos[1] = (canvasWH[1] - 30) / 2

      const ringRadius = this.ringRadius = Math.min(...canvasWH) * 0.6 / 2

      this.ringLineWidth = ringRadius * 0.3
    },
    draw () {
      const { ctx, canvasWH } = this

      ctx.clearRect(0, 0, ...canvasWH)

      const { caclArcData, data: { active }, drawActive, drwaStatic } = this

      caclArcData()

      active ? drawActive() : drwaStatic()
    },
    caclArcData () {
      const { data: { data } } = this

      const { getTotalValue, offsetAngle } = this

      const totalValue = getTotalValue()

      const full = 2 * Math.PI

      const aveAngle = full / data.length

      let currentPercent = offsetAngle

      this.arcData = []

      data.forEach(({ value }) => {
        const valueAngle = totalValue === 0 ? aveAngle : value / totalValue * full

        this.arcData.push([
          currentPercent,
          currentPercent += valueAngle
        ])
      })
    },
    getTotalValue () {
      const { data: { data } } = this

      let totalValue = 0

      data.forEach(({ value }) => (totalValue += value))

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
      const { arcData, ctx, ringOriginPos, radiusData } = this

      const { ringLineWidth, data: { color } } = this

      const arcNum = arcData.length

      arcData.forEach((arc, i) => {
        ctx.beginPath()

        ctx.arc(...ringOriginPos, radiusData[i], ...arc)

        ctx.lineWidth = ringLineWidth

        ctx.strokeStyle = color[i % arcNum]

        ctx.stroke()
      })
    },
    doPercentAnimation () {
      const { totalValue, percent, activeIndex, data: { data }, doPercentAnimation } = this

      if (!totalValue) return

      let currentPercent = Math.trunc(data[activeIndex].value / totalValue * 100)

      currentPercent === 0 && (currentPercent = 1)

      if (currentPercent === percent) return

      currentPercent > percent ? this.percent++ : this.percent--

      setTimeout(doPercentAnimation, 20)
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
      const { arcData, ringRadius, ringLineWidth, ringOriginPos: [x, y], data: { data }, canvas, totalValue } = this

      const { getCircleRadianPoint } = canvas

      const radian = arcData.map(([a, b]) => (a + (b - a) / 2))

      const radius = ringRadius + ringLineWidth / 2

      const aroundLineData = radian.map(r => getCircleRadianPoint(x, y, radius, r))

      const lineLength = 35

      this.aroundLineData = aroundLineData.map(([bx, by], i) => {
        if (!data[i].value && totalValue) return [false, false]

        const lineEndXPos = (bx > x ? bx + lineLength : bx - lineLength)

        return [
          [bx, by],
          [lineEndXPos, by]
        ]
      })
    },
    drawAroundLine () {
      const { aroundLineData, data: { color }, ctx, canvas: { drawLine } } = this

      const colorNum = color.length

      aroundLineData.forEach(([lineBegin, lineEnd], i) =>
        lineBegin !== false &&
        drawLine(ctx, lineBegin, lineEnd, 1, color[i % colorNum]))
    },
    calcAroundTextData () {
      const { data: { data }, totalValue } = this

      const aroundTextData = this.aroundTextData = []

      data.forEach(({ value, title }, i) => {
        if (!value && totalValue) return aroundTextData.push([false, false])

        let percent = value / totalValue * 100

        percent < 1 ? (percent = percent.toFixed(2)) : (percent = Math.trunc(percent))

        percent += '%'

        !totalValue && (percent = '0%')

        aroundTextData.push([percent, title])
      })
    },
    drawAroundText () {
      const { ctx, aroundTextData, aroundTextFont, aroundLineData, ringOriginPos: [x] } = this

      ctx.font = aroundTextFont
      ctx.fillStyle = '#fff'

      aroundTextData.forEach(([percent, title], i) => {
        if (percent === false) return

        const currentPos = aroundLineData[i][1]

        ctx.textAlign = 'start'

        currentPos[0] < x && (ctx.textAlign = 'end')

        ctx.textBaseline = 'bottom'
        ctx.fillText(percent, ...currentPos)

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

  canvas {
    width: 100%;
    height: 100%;
  }

  .center-info {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    margin-top: -20px;
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

  .label-line {
    position: absolute;
    width: 100%;
    height: 30px;
    bottom: 0px;
    font-size: 12px;
    line-height: 30px;
    color: rgba(255, 255, 255, 0.6);
    display: flex;
    justify-content: space-around;

    .label-container {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
    }

    .label {
      display: flex;
      flex-direction: row;
      margin: 0 3px;
      height: 20px;

      :nth-child(1) {
        width: 10px;
        height: 10px;
        margin-top: 10px;
        margin-right: 3px;
      }
    }
  }
}
</style>
