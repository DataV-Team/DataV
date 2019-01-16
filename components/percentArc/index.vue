<template>
  <div class="percent-arc">
    <loading v-if="!percent || percent === 0" />

    <div class="canvas-container">
      <canvas :ref="ref" />
    </div>

    <div class="for-slot">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import canvasMixin from '../../mixins/canvasMixin.js'

export default {
  name: 'PercentArc',
  props: ['percent', 'ringColor', 'arcColor', 'ringLineWidth', 'arcLineWidth', 'radius', 'arcType'],
  mixins: [canvasMixin],
  data () {
    return {
      ref: `percent-arc-${(new Date()).getTime()}`,

      defaultRadius: 0.9,
      defaultRingLineWidth: 4,
      defaultArcLineWidth: 10,
      defaultArcType: 'butt',

      defaultRingColor: '#00BAFF',
      defaultArcColor: ['#00BAFF', '#3DE7C9'],

      trueArcType: '',
      trueRadius: 0,
      ringRadius: 0,
      arcRadius: 0,
      trueRingColor: '',
      trueArcColor: '',
      trueRingLineWidth: 0,
      trueArcLineWidth: 0
    }
  },
  watch: {
    percent () {
      const { init } = this

      init()
    },
    ringColor () {
      const { init } = this

      init()
    },
    arcColor () {
      const { init } = this

      init()
    },
    ringLineWidth () {
      const { init } = this

      init()
    },
    arcLineWidth () {
      const { init } = this

      init()
    },
    radius () {
      const { init } = this

      init()
    },
    arcType () {
      const { init } = this

      init()
    }
  },
  methods: {
    async init () {
      const { initCanvas, draw } = this

      await initCanvas()

      draw()
    },
    draw () {
      const { percent } = this

      if (!percent && percent !== 0) return

      const { clearCanvas } = this

      clearCanvas()

      const { calcLineWidth, calcRaidus, calcColors } = this

      calcLineWidth()

      calcRaidus()

      calcColors()

      const { calcArcType, drawRing, drawArc } = this

      calcArcType()

      drawRing()

      drawArc()
    },
    calcLineWidth () {
      const { defaultRingLineWidth, defaultArcLineWidth, ringLineWidth, arcLineWidth } = this

      this.trueRingLineWidth = ringLineWidth || defaultRingLineWidth

      this.trueArcLineWidth = arcLineWidth || defaultArcLineWidth
    },
    calcRaidus () {
      const { radius, defaultRadius, canvasWH } = this

      const trueRadius = this.trueRadius = radius || defaultRadius

      const ringRadius = this.ringRadius = Math.min(...canvasWH) * trueRadius / 2

      const { trueRingLineWidth, trueArcLineWidth } = this

      const halfRingLineWidth = trueRingLineWidth / 2

      const halfArcLineWidth = trueArcLineWidth / 2

      this.arcRadius = ringRadius - halfRingLineWidth - halfArcLineWidth
    },
    calcColors () {
      const { ringColor, defaultRingColor } = this

      this.trueRingColor = ringColor || defaultRingColor

      const { arcColor, defaultArcColor } = this

      this.trueArcColor = arcColor || defaultArcColor
    },
    calcArcType () {
      const { arcType, defaultArcType } = this

      this.trueArcType = arcType || defaultArcType
    },
    drawRing () {
      const { ringRadius, ctx, trueRingLineWidth, centerPos, trueRingColor } = this

      ctx.lineWidth = trueRingLineWidth

      ctx.strokeStyle = trueRingColor

      ctx.beginPath()

      ctx.arc(...centerPos, ringRadius, 0, Math.PI * 2)

      ctx.stroke()
    },
    drawArc () {
      const { ctx, centerPos, percent, trueArcType, canvasWH } = this

      const { trueArcLineWidth, arcRadius, trueArcColor } = this

      const { canvas: { getLinearGradientColor } } = this

      const fullArc = Math.PI * 2

      const offsetArc = Math.PI / 2

      const arcBegin = offsetArc * -1

      const arcEnd = fullArc * percent / 100 - offsetArc

      ctx.lineCap = trueArcType

      ctx.lineWidth = trueArcLineWidth

      ctx.strokeStyle = getLinearGradientColor(ctx, [0, 0], [0, canvasWH[1]], trueArcColor)

      ctx.beginPath()

      ctx.arc(...centerPos, arcRadius, arcBegin, arcEnd)

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
.percent-arc {
  position: relative;
  display: flex;

  .canvas-container {
    flex: 1;

    canvas {
      width: 100%;
      height: 100%;
    }
  }

  .for-slot {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
