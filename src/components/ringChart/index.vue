<template>
  <div class="ring-chart">
    <canvas :ref="ref" />

    <div class="center-info">
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
  </div>
</template>

<script>
export default {
  name: 'RingChart',
  props: ['data'],
  data () {
    return {
      ref: `ring-chart-${(new Date()).getTime()}`,
      canvas: '',
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

      activeIncrease: 0.005,
      activeTime: 2500,

      offsetAngle: Math.PI * 0.5 * -1,

      percent: 0,
      totalValue: 0,

      activeAnimationHandler: ''
    }
  },
  watch: {
    data (d) {
      console.error(d)
    },
    activeIndex () {

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

      const canvas = this.canvas = $refs[ref]

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
      const { caclArcData, data: { active }, drwaActive, drwaStatic } = this

      caclArcData()

      active ? drwaActive() : drwaStatic()
    },
    caclArcData () {
      const { data: { data }, arcData } = this

      const { getTotalValue, offsetAngle } = this

      const totalValue = getTotalValue()

      const full = 2 * Math.PI

      let currentPercent = offsetAngle

      data.forEach(({ value }) => {
        const currentAngle = value / totalValue * full + currentPercent

        arcData.push([
          currentPercent,
          currentAngle
        ])

        currentPercent = currentAngle
      })
    },
    getTotalValue () {
      const { data: { data } } = this

      let totalValue = 0

      data.forEach(({ value }) => (totalValue += value))

      this.totalValue = totalValue

      return totalValue
    },
    drwaActive () {
      const { ctx, canvasWH } = this

      ctx.clearRect(0, 0, ...canvasWH)

      const { calcRadiusData, drawRing, drwaActive } = this

      calcRadiusData()

      drawRing()

      this.activeAnimationHandler = requestAnimationFrame(drwaActive)
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

      setTimeout(turnToNextActive, activeTime)
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
    drwaStatic () {}
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
      margin-top: 15px;
      transform: rotateY(0deg);
    }

    .transform-text {
      animation: tranform-text 1s linear;
    }

    @keyframes transform-text {
      from {
        transform: rotateY(0deg);
      }

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
    }

    .label {
      display: flex;
      flex-direction: row;
      margin: 0 3px;

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
